# SSLCommerz Payment Integration - Code Examples

Complete code examples for integrating Auto Spark's SSLCommerz payment gateway into your application.

## Table of Contents

1. [Payment Service Class](#payment-service-class)
2. [React Components](#react-components)
3. [Node.js/Express Backend](#nodejs-express-backend)
4. [Environment Configuration](#environment-configuration)
5. [Error Handling](#error-handling)
6. [Testing](#testing)

---

## Payment Service Class

### `services/PaymentService.ts`

```typescript
interface PaymentInitRequest {
  total_amount: number;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  product_name?: string;
  product_category?: string;
}

interface PaymentStatus {
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  createdAt: string;
  paidAt?: string;
}

class PaymentService {
  private apiEndpoint: string;

  constructor(endpoint: string = process.env.REACT_APP_PAYMENT_API || '') {
    this.apiEndpoint = endpoint;
  }

  /**
   * Initiate a payment transaction
   */
  async initiatePayment(data: PaymentInitRequest): Promise<{
    redirectUrl: string;
    tranId: string;
  }> {
    const response = await fetch(`${this.apiEndpoint}/payment/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Payment initialization failed');
    }

    return result.data;
  }

  /**
   * Check payment status
   */
  async getPaymentStatus(tranId: string): Promise<PaymentStatus> {
    const response = await fetch(`${this.apiEndpoint}/payment/status/${tranId}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch payment status');
    }

    return result.data;
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(): Promise<{
    total: number;
    pending: number;
    paid: number;
    failed: number;
    cancelled: number;
  }> {
    const response = await fetch(`${this.apiEndpoint}/payment/stats`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch statistics');
    }

    return result.data;
  }
}

export default PaymentService;
```

---

## React Components

### `components/CheckoutForm.tsx`

```typescript
import React, { useState, FormEvent } from 'react';
import PaymentService from '../services/PaymentService';

interface CheckoutFormProps {
  totalAmount: number;
  onSuccess?: (tranId: string) => void;
  onError?: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  totalAmount,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Dhaka'
  });

  const paymentService = new PaymentService();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { redirectUrl, tranId } = await paymentService.initiatePayment({
        total_amount: totalAmount,
        cus_name: formData.name,
        cus_email: formData.email,
        cus_phone: formData.phone,
        cus_city: formData.city,
        product_name: 'Auto Spark Vehicle',
        product_category: 'automotive'
      });

      if (onSuccess) onSuccess(tranId);
      
      // Redirect to payment gateway
      window.location.href = redirectUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {error && <div className="error-alert">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="John Doe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="john@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number (BD)</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          placeholder="01711111111"
          pattern="01[0-9]{9}"
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">City</label>
        <select
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
        >
          <option value="Dhaka">Dhaka</option>
          <option value="Chittagong">Chittagong</option>
          <option value="Sylhet">Sylhet</option>
          <option value="Khulna">Khulna</option>
          <option value="Rajshahi">Rajshahi</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Processing...' : `Pay BDT ${totalAmount.toLocaleString()}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
```

### `pages/PaymentSuccess.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import PaymentService from '../services/PaymentService';

const PaymentSuccess: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [order, setOrder] = useState<any>(null);
  const paymentService = new PaymentService();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tranId = params.get('tran_id');

    if (!tranId) {
      setStatus('error');
      return;
    }

    paymentService
      .getPaymentStatus(tranId)
      .then(data => {
        setOrder(data);
        setStatus(data.status === 'paid' ? 'success' : 'loading');
      })
      .catch(() => {
        setStatus('error');
      });
  }, []);

  if (status === 'loading') {
    return <div className="message">Verifying your payment...</div>;
  }

  if (status === 'error') {
    return (
      <div className="message error">
        <h2>Unable to Verify Payment</h2>
        <p>Please contact support or try again later.</p>
      </div>
    );
  }

  return (
    <div className="message success">
      <h2>Payment Successful!</h2>
      <p>Your order has been confirmed.</p>
      <div className="order-details">
        <p>Transaction ID: <code>{order?.tranId}</code></p>
        <p>Amount: <strong>BDT {order?.amount.toLocaleString()}</strong></p>
        <p>Date: {new Date(order?.paidAt).toLocaleString()}</p>
      </div>
      <a href="/orders" className="btn-primary">View Your Orders</a>
    </div>
  );
};

export default PaymentSuccess;
```

---

## Node.js/Express Backend

### `routes/payments.ts`

```typescript
import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

const PAYMENT_API = process.env.PAYMENT_API;
const paymentService = new PaymentService(PAYMENT_API);

/**
 * POST /api/payments/orders
 * Create an order and initiate payment
 */
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const {
      vehicle_id,
      customer_name,
      customer_email,
      customer_phone,
      amount
    } = req.body;

    // Validate input
    if (!vehicle_id || !customer_name || !customer_email || !customer_phone || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create order in database
    const order = await db.orders.create({
      vehicle_id,
      customer_name,
      customer_email,
      customer_phone,
      amount,
      status: 'pending',
      created_at: new Date()
    });

    // Initiate payment with gateway
    const { redirectUrl, tranId } = await paymentService.initiatePayment({
      total_amount: amount,
      cus_name: customer_name,
      cus_email: customer_email,
      cus_phone: customer_phone,
      product_name: `Vehicle (${vehicle_id})`,
      product_category: 'automotive'
    });

    // Update order with transaction ID
    await db.orders.update(order.id, { tran_id: tranId });

    res.json({
      success: true,
      redirectUrl,
      tranId,
      orderId: order.id
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * GET /api/payments/orders/:orderId/status
 * Check payment status
 */
router.get('/orders/:orderId/status', async (req: Request, res: Response) => {
  try {
    const order = await db.orders.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const paymentStatus = await paymentService.getPaymentStatus(order.tran_id);

    // Update order if paid
    if (paymentStatus.status === 'paid') {
      await db.orders.update(order.id, {
        status: 'paid',
        paid_at: new Date()
      });
    }

    res.json({ success: true, order: paymentStatus });
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

/**
 * GET /api/payments/stats
 * Get payment statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await paymentService.getPaymentStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
```

---

## Environment Configuration

### `.env.local` (Frontend)

```env
REACT_APP_PAYMENT_API=https://your-appwrite-function-endpoint
REACT_APP_ENV=production
```

### `.env` (Backend)

```env
PAYMENT_API=https://your-appwrite-function-endpoint
DATABASE_URL=your_database_connection
NODE_ENV=production
```

---

## Error Handling

### `utils/errorHandler.ts`

```typescript
interface PaymentError {
  code: string;
  message: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  'INVALID_AMOUNT': 'Amount must be a positive number',
  'INVALID_EMAIL': 'Please provide a valid email address',
  'INVALID_PHONE': 'Please provide a valid Bangladesh phone number',
  'GATEWAY_ERROR': 'Payment gateway is temporarily unavailable',
  'DATABASE_ERROR': 'Order creation failed. Please try again',
  'IPN_VALIDATION_FAILED': 'Payment validation failed',
  'ORDER_NOT_FOUND': 'Order not found',
  'NETWORK_ERROR': 'Network error. Please check your connection'
};

export function getErrorMessage(error: PaymentError | Error | string): string {
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  if ('code' in error) {
    return ERROR_MESSAGES[error.code] || error.message;
  }

  return error.message || 'An unexpected error occurred';
}
```

---

## Testing

### Test Payment with cURL

```bash
# Initialize payment
curl -X POST https://your-function-endpoint/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "total_amount": 50000,
    "cus_name": "Test User",
    "cus_email": "test@example.com",
    "cus_phone": "01711111111",
    "product_name": "Test Vehicle",
    "product_category": "automotive"
  }'

# Check payment status (replace TRAN_ID)
curl https://your-function-endpoint/payment/status/TRAN_ID

# Get statistics
curl https://your-function-endpoint/payment/stats
```

### Test Credit Card (Sandbox)
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** 12/25
- **CVV:** 123

---

## Quick Integration Checklist

- [ ] Copy PaymentService class
- [ ] Add CheckoutForm component to checkout page
- [ ] Add PaymentSuccess page for redirect
- [ ] Configure environment variables
- [ ] Update backend routes
- [ ] Test payment flow
- [ ] Deploy to production

For detailed documentation, see [README.md](functions/sslcommerz-api/README.md) and [Deployment Guide](SSLCOMMERZ_DEPLOYMENT_GUIDE.md).
