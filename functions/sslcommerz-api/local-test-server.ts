/**
 * Local Test Server for SSLCommerz Payment Gateway
 * 
 * This is a simple Express server for local development testing.
 * It wraps the main payment handler for local testing WITHOUT Appwrite.
 * 
 * Usage:
 *   npm install express cors
 *   npx ts-node local-test-server.ts
 * 
 * Then test:
 *   http://localhost:3000/health
 *   http://localhost:3000/payment/init (POST)
 */

import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// ============================================================================
// MOCK DATA - Replace with real Appwrite SDK if testing full flow
// ============================================================================

interface MockOrder {
  $id: string;
  tran_id: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  [key: string]: any;
}

const mockOrders: Map<string, MockOrder> = new Map();

// ============================================================================
// UTILITIES (Copied from src/utils.ts)
// ============================================================================

function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AS_LIVE_${timestamp}_${random}`;
}

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidBDPhone(phone: string): boolean {
  const regex = /^(\+88|88)?01[3-9]\d{8}$/;
  return regex.test(phone.replace(/\D/g, ''));
}

function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 999999999 && Number.isFinite(amount);
}

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function maskSensitive(data: string): string {
  if (data.length <= 4) return '*'.repeat(data.length);
  return data.slice(0, 2) + '*'.repeat(data.length - 4) + data.slice(-2);
}

function logPaymentEvent(event: string, data: any): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${event}:`, JSON.stringify(data, null, 2));
}

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Health Check Endpoint
 * GET /health
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'SSLCommerz Payment Gateway',
    environment: 'local-test',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * Payment Initialization Endpoint
 * POST /payment/init
 * 
 * Expected body:
 * {
 *   "customerName": "John Doe",
 *   "customerEmail": "john@example.com",
 *   "customerPhone": "01712345678",
 *   "amount": 5000,
 *   "productName": "Car Parts",
 *   "productCategory": "parts"
 * }
 */
app.post('/payment/init', async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, customerPhone, amount, productName, productCategory } = req.body;

    // Validation
    if (!customerName || !customerEmail || !customerPhone || !amount || !productName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['customerName', 'customerEmail', 'customerPhone', 'amount', 'productName'],
      });
    }

    if (!isValidEmail(customerEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    if (!isValidBDPhone(customerPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid BD phone number',
      });
    }

    if (!isValidAmount(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount. Must be between 0.01 and 999999999',
      });
    }

    // Generate transaction ID
    const tran_id = generateTransactionId();

    // Create mock order
    const order: MockOrder = {
      $id: tran_id,
      tran_id,
      status: 'pending',
      amount,
      customerName,
      customerEmail,
      customerPhone,
      productName,
      productCategory: productCategory || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrders.set(tran_id, order);

    logPaymentEvent('PAYMENT_INIT', {
      tran_id,
      amount,
      customer: customerEmail,
      status: 'success',
    });

    // In production, this would be SSLCommerz gateway URL
    const redirectUrl = `https://sandbox.sslcommerz.com/gwprocess/testv4`;

    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      tran_id,
      redirectUrl,
      data: {
        tran_id,
        amount: formatAmount(amount),
        currency: 'BDT',
        productName,
        redirectUrl,
        // In actual implementation, include SSLCommerz session data
        note: 'In local test, use SSLCommerz sandbox. In production, real gateway will be used.',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logPaymentEvent('PAYMENT_INIT_ERROR', { error: errorMessage });

    res.status(500).json({
      success: false,
      error: 'Payment initialization failed',
      details: errorMessage,
    });
  }
});

/**
 * Payment Status Check Endpoint
 * GET /payment/status/:tranId
 */
app.get('/payment/status/:tranId', (req: Request, res: Response) => {
  try {
    const { tranId } = req.params;

    const order = mockOrders.get(tranId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        tran_id: tranId,
      });
    }

    logPaymentEvent('PAYMENT_STATUS_CHECK', {
      tran_id: tranId,
      status: order.status,
    });

    res.status(200).json({
      success: true,
      data: {
        tran_id: order.tran_id,
        status: order.status,
        amount: order.amount,
        customerEmail: order.customerEmail,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: 'Failed to check payment status',
      details: errorMessage,
    });
  }
});

/**
 * Statistics Endpoint
 * GET /payment/stats
 */
app.get('/payment/stats', (req: Request, res: Response) => {
  try {
    const orders = Array.from(mockOrders.values());
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);
    const paidAmount = orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + o.amount, 0);

    logPaymentEvent('PAYMENT_STATS', {
      totalOrders,
      paidOrders,
      pendingOrders,
      totalAmount,
      paidAmount,
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        paidOrders,
        pendingOrders,
        failedOrders: orders.filter(o => o.status === 'failed').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalAmount: totalAmount.toFixed(2),
        paidAmount: paidAmount.toFixed(2),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics',
      details: errorMessage,
    });
  }
});

/**
 * Manual Payment Status Update (for testing)
 * POST /payment/test/mark-as-paid/:tranId
 * 
 * This endpoint allows you to manually mark a payment as paid for testing.
 */
app.post('/payment/test/mark-as-paid/:tranId', (req: Request, res: Response) => {
  try {
    const { tranId } = req.params;
    const order = mockOrders.get(tranId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    order.status = 'paid';
    order.updatedAt = new Date().toISOString();
    order.payment_method = 'sslcommerz-test';
    order.validation_id = `test_val_${Date.now()}`;

    logPaymentEvent('MANUAL_PAYMENT_MARK', {
      tran_id: tranId,
      status: 'paid',
      note: 'Marked as paid for testing',
    });

    res.status(200).json({
      success: true,
      message: 'Order marked as paid',
      data: order,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: 'Failed to mark order as paid',
      details: errorMessage,
    });
  }
});

/**
 * Error Handler
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message || 'Unknown error',
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Local Test Server Started');
  console.log('='.repeat(60));
  console.log(`\n📍 Server URL: http://localhost:${PORT}`);
  console.log(`\n📚 Available Endpoints:\n`);
  console.log(`  ✅ GET    /health`);
  console.log(`  ✅ POST   /payment/init`);
  console.log(`  ✅ GET    /payment/status/:tranId`);
  console.log(`  ✅ GET    /payment/stats`);
  console.log(`  ⚙️  POST   /payment/test/mark-as-paid/:tranId (testing only)`);
  console.log(`\n📝 Test Examples:\n`);
  console.log(`  1. Health Check:`);
  console.log(`     curl http://localhost:${PORT}/health\n`);
  console.log(`  2. Initialize Payment:`);
  console.log(`     curl -X POST http://localhost:${PORT}/payment/init \\`);
  console.log(`       -H "Content-Type: application/json" \\`);
  console.log(`       -d '{`);
  console.log(`         "customerName": "John Doe",`);
  console.log(`         "customerEmail": "john@example.com",`);
  console.log(`         "customerPhone": "01712345678",`);
  console.log(`         "amount": 5000,`);
  console.log(`         "productName": "Car Parts"`);
  console.log(`       }'\n`);
  console.log(`  3. Check Payment Status:`);
  console.log(`     curl http://localhost:${PORT}/payment/status/AS_LIVE_XXXXX\n`);
  console.log(`  4. Get Statistics:`);
  console.log(`     curl http://localhost:${PORT}/payment/stats\n`);
  console.log(`\n🛑 Press Ctrl+C to stop the server\n`);
  console.log('='.repeat(60) + '\n');
});

export default app;
