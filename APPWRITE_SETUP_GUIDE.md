# 🚀 Appwrite Complete Setup Guide

## What is Appwrite?

Appwrite is an **open-source backend-as-a-service (BaaS)** that gives you:
- Database (documents & collections)
- Authentication
- File storage
- Real-time subscriptions
- REST/GraphQL APIs

**You can run it:**
- 🌐 On Appwrite Cloud (managed service)
- 🏠 Locally with Docker (for development)
- 🖥️ On your own server (self-hosted)

---

## Phase 1: Set Up Appwrite (30 minutes)

### Option A: Use Appwrite Cloud (Easiest) ⭐

**Step 1: Create Free Account**
1. Go to https://cloud.appwrite.io
2. Click "Sign Up"
3. Enter email and password
4. Verify email
5. You're in!

**Step 2: Create Project**
1. Click "Create Project"
2. Name it: `autospark-payment`
3. Set region: `Singapore` (closest to Bangladesh)
4. Click "Create"

**Step 3: Get Your Project ID**
1. Go to Settings → General
2. Copy: **Project ID** (save this)
3. Go to Settings → API Keys
4. Click "Create API Key"
5. Name it: `payment-key`
6. Check: `databases.read`, `databases.write`, `databases.update`
7. Copy the **API Key** (save this)

**Step 4: Get Your Endpoint**
- **Endpoint:** `https://cloud.appwrite.io/v1`

---

### Option B: Run Appwrite Locally with Docker

**Requirements:**
- Docker installed on your computer
- 2GB RAM available

**Step 1: Install Docker**
- Mac: https://www.docker.com/products/docker-desktop
- Windows: https://www.docker.com/products/docker-desktop
- Linux: `sudo apt install docker.io`

**Step 2: Start Appwrite**
```bash
docker run -d \
  --name=appwrite \
  -p 80:80 \
  -p 443:443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /Users/farhankabir/Documents/a-s/autospark/appwrite_data:/storage \
  appwrite/appwrite:latest
```

**Step 3: Access Appwrite**
- Go to: http://localhost
- Create admin account
- Create project
- Note: You'll get Endpoint: `http://localhost/v1`

---

## Phase 2: Create Database in Appwrite (15 minutes)

**Step 1: In Appwrite Console**
1. Open your project
2. Go to "Databases" (left menu)
3. Click "Create Database"
4. Name: `autospark_db`
5. Click "Create"

**Step 2: Create Collection**
1. Inside your database, click "Create Collection"
2. Name: `payments`
3. Click "Create"

**Step 3: Add Attributes (Fields)**

Add these fields to your collection:

| Attribute Name | Type | Size | Required |
|---|---|---|---|
| `customer_name` | String | 255 | Yes |
| `mobile` | String | 20 | Yes |
| `email` | String | 255 | No |
| `address` | String | 500 | Yes |
| `thana` | String | 100 | Yes |
| `district` | String | 100 | Yes |
| `total_amount` | Float | - | Yes |
| `cart_items` | String | 5000 | Yes |
| `session_id` | String | 255 | Yes |
| `transaction_id` | String | 255 | No |
| `status` | String | 50 | Yes |
| `gateway_status` | String | 50 | No |
| `created_at` | DateTime | - | Yes |
| `updated_at` | DateTime | - | No |

**How to add attributes:**
1. Click "Create Attribute"
2. Fill in the details
3. Click "Create"
4. Repeat for each field

---

## Phase 3: Install Appwrite SDK (5 minutes)

**Step 1: Install Package**
```bash
npm install appwrite
```

**Step 2: Add to .env file**

Open `.env` and add:
```
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=autospark_db
VITE_APPWRITE_COLLECTION_ID=payments
VITE_APPWRITE_API_KEY=your_api_key_here

# SSLCommerz (already in your .env)
VITE_SSLCOMMERZ_STORE_ID=autosparkbd0live
VITE_SSLCOMMERZ_STORE_PASSWORD=69DBB19BAB55E48107
VITE_SITE_URL=http://localhost:5173
```

**Get your IDs:**
- `VITE_APPWRITE_PROJECT_ID` → From Appwrite Settings → General
- `VITE_APPWRITE_API_KEY` → From Appwrite Settings → API Keys
- `VITE_APPWRITE_DATABASE_ID` → Name of database you created (autospark_db)
- `VITE_APPWRITE_COLLECTION_ID` → Name of collection (payments)

---

## Phase 4: Create Payment Service (20 minutes)

**Step 1: Create File**

Create: `src/services/appwriteService.ts`

```typescript
import { Client, Databases, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Save payment request to database
export const savePaymentRequest = async (paymentData: {
  customer_name: string;
  mobile: string;
  address: string;
  thana: string;
  district: string;
  total_amount: number;
  cart_items: any[];
}) => {
  try {
    const sessionId = `session_${Date.now()}`;
    
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        customer_name: paymentData.customer_name,
        mobile: paymentData.mobile,
        address: paymentData.address,
        thana: paymentData.thana,
        district: paymentData.district,
        total_amount: paymentData.total_amount,
        cart_items: JSON.stringify(paymentData.cart_items),
        session_id: sessionId,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
    );

    console.log('Payment saved:', response);
    return response;
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};

// Update payment status after SSLCommerz callback
export const updatePaymentStatus = async (
  documentId: string,
  status: 'success' | 'failed' | 'cancelled',
  transactionId?: string
) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      {
        status: status,
        transaction_id: transactionId || null,
        updated_at: new Date().toISOString(),
      }
    );

    console.log('Payment updated:', response);
    return response;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

// Get payment by ID
export const getPaymentById = async (documentId: string) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );
    return response;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

// Get all payments (for admin dashboard)
export const getAllPayments = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
    );
    return response;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};
```

---

## Phase 5: Update PaymentPage.tsx (30 minutes)

**Step 1: Import Service**

Open `src/pages/PaymentPage.tsx` and add at the top:

```typescript
import { savePaymentRequest } from '../services/appwriteService';
```

**Step 2: Modify Form Submission**

Find your form submission handler (usually `onSubmit` or `handleSubmit`) and replace it with:

```typescript
const onSubmit = async (formData) => {
  try {
    // Show loading
    setIsLoading(true);

    // 1. Save payment request to Appwrite database
    console.log('Saving payment to database...');
    const paymentRecord = await savePaymentRequest({
      customer_name: formData.customer_name,
      mobile: formData.mobile,
      address: formData.address,
      thana: formData.thana,
      district: formData.district,
      total_amount: cartTotal,
      cart_items: cartItems,
    });

    console.log('Payment record created:', paymentRecord);

    // 2. Call SSLCommerz API
    console.log('Calling SSLCommerz...');
    const sslResponse = await fetch('/api/payment/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: formData.customer_name,
        mobile: formData.mobile,
        address: formData.address,
        thana: formData.thana,
        district: formData.district,
        total_amount: cartTotal,
        cart_items: cartItems,
        payment_record_id: paymentRecord.$id, // Send Appwrite document ID
      }),
    });

    const sslResult = await sslResponse.json();
    console.log('SSLCommerz response:', sslResult);

    // 3. Redirect to SSLCommerz gateway
    if (sslResult.GatewayPageURL) {
      console.log('Redirecting to gateway...');
      window.location.href = sslResult.GatewayPageURL;
    } else {
      throw new Error('No gateway URL received from SSLCommerz');
    }
  } catch (error) {
    console.error('Payment error:', error);
    setIsLoading(false);
    alert(`Payment failed: ${error.message}`);
  }
};
```

---

## Phase 6: Update Payment API Endpoint (20 minutes)

**Step 1: Update /api/payment/init.ts**

If you're using Node.js backend, replace the content with:

```typescript
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      customer_name,
      mobile,
      address,
      thana,
      district,
      total_amount,
      cart_items,
      payment_record_id,
    } = req.body;

    // Validate required fields
    if (!customer_name || !mobile || !total_amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare SSLCommerz payload
    const sslPayload = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: total_amount,
      currency: 'BDT',
      tran_id: `TXN_${Date.now()}_${payment_record_id}`,
      success_url: `${process.env.VITE_SITE_URL}/payment-success?payment_id=${payment_record_id}`,
      fail_url: `${process.env.VITE_SITE_URL}/payment-fail?payment_id=${payment_record_id}`,
      cancel_url: `${process.env.VITE_SITE_URL}/payment-cancel?payment_id=${payment_record_id}`,

      // Customer info
      cust_name: customer_name,
      cust_email: 'customer@example.com', // TODO: Add email field to form
      cust_phone: mobile,

      // Shipping info
      ship_name: customer_name,
      ship_add1: address,
      ship_city: thana,
      ship_state: district,
      ship_postcode: '1000',
      ship_country: 'Bangladesh',

      // Product info
      product_name: 'Accessories',
      product_category: 'automotive',
      product_profile: 'physical-goods',
    };

    // Call SSLCommerz API
    const response = await axios.post(
      'https://securepay.sslcommerz.com/gwprocess/v4/api.php',
      new URLSearchParams(sslPayload),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const data = new URLSearchParams(response.data);
    const result = {
      status: data.get('status'),
      GatewayPageURL: data.get('GatewayPageURL'),
      sessionkey: data.get('sessionkey'),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Payment error:', error);
    return res
      .status(500)
      .json({ error: 'Payment initiation failed', details: error.message });
  }
}
```

---

## Phase 7: Create Callback Pages (30 minutes)

### Create PaymentSuccessPage.tsx

Create: `src/pages/PaymentSuccessPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { updatePaymentStatus, getPaymentById } from '../services/appwriteService';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        if (!paymentId) {
          throw new Error('No payment ID provided');
        }

        // Update payment status in database
        await updatePaymentStatus(paymentId, 'success');

        // Get updated payment record
        const paymentData = await getPaymentById(paymentId);
        setPayment(paymentData);

        // Clear cart
        localStorage.removeItem('cart');
      } catch (err) {
        console.error('Error handling success:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    handleSuccess();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">💳</div>
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase.</p>

        {payment && (
          <div className="bg-gray-100 p-4 rounded text-left mb-6">
            <p className="mb-2">
              <strong>Order ID:</strong> {payment.$id}
            </p>
            <p className="mb-2">
              <strong>Amount:</strong> ৳{payment.total_amount}
            </p>
            <p className="mb-2">
              <strong>Customer:</strong> {payment.customer_name}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="text-green-600 font-bold">SUCCESS</span>
            </p>
          </div>
        )}

        <button
          onClick={() => (window.location.href = '/')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
```

### Create PaymentFailPage.tsx

Create: `src/pages/PaymentFailPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { updatePaymentStatus, getPaymentById } from '../services/appwriteService';

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const handleFailure = async () => {
      try {
        if (!paymentId) throw new Error('No payment ID provided');

        // Update payment status to failed
        await updatePaymentStatus(paymentId, 'failed');

        // Get updated payment record
        const paymentData = await getPaymentById(paymentId);
        setPayment(paymentData);
      } catch (err) {
        console.error('Error handling failure:', err);
      } finally {
        setLoading(false);
      }
    };

    handleFailure();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Processing...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed.
        </p>

        {payment && (
          <div className="bg-gray-100 p-4 rounded text-left mb-6">
            <p className="mb-2">
              <strong>Order ID:</strong> {payment.$id}
            </p>
            <p className="mb-2">
              <strong>Amount:</strong> ৳{payment.total_amount}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="text-red-600 font-bold">FAILED</span>
            </p>
          </div>
        )}

        <button
          onClick={() => (window.location.href = '/payment')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-2"
        >
          Try Again
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
```

### Create PaymentCancelPage.tsx

Create: `src/pages/PaymentCancelPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { updatePaymentStatus, getPaymentById } from '../services/appwriteService';

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const handleCancel = async () => {
      try {
        if (!paymentId) throw new Error('No payment ID provided');

        // Update payment status to cancelled
        await updatePaymentStatus(paymentId, 'cancelled');

        // Get updated payment record
        const paymentData = await getPaymentById(paymentId);
        setPayment(paymentData);
      } catch (err) {
        console.error('Error handling cancellation:', err);
      } finally {
        setLoading(false);
      }
    };

    handleCancel();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Processing...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          You have cancelled the payment process.
        </p>

        {payment && (
          <div className="bg-gray-100 p-4 rounded text-left mb-6">
            <p className="mb-2">
              <strong>Order ID:</strong> {payment.$id}
            </p>
            <p className="mb-2">
              <strong>Amount:</strong> ৳{payment.total_amount}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="text-yellow-600 font-bold">CANCELLED</span>
            </p>
          </div>
        )}

        <button
          onClick={() => (window.location.href = '/payment')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-2"
        >
          Complete Payment
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
```

---

## Phase 8: Add Routes (5 minutes)

Update your Router in `src/App.tsx`:

```typescript
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

// Inside your route definitions:
<Route path="/payment-success" element={<PaymentSuccessPage />} />
<Route path="/payment-fail" element={<PaymentFailPage />} />
<Route path="/payment-cancel" element={<PaymentCancelPage />} />
```

---

## Phase 9: Test Locally (30 minutes)

**Step 1: Start Your Dev Server**
```bash
npm run dev
```

**Step 2: Test Payment Flow**
1. Go to http://localhost:5173
2. Navigate to Accessories page
3. Add items to cart
4. Click "Proceed to Checkout"
5. Fill payment form with test data:
   - Name: Test User
   - Mobile: 01911223344
   - Address: Test Address
   - District: Dhaka
   - Thana: Mirpur
6. Click "Submit Payment"
7. Should redirect to SSLCommerz

**Step 3: Check Appwrite Database**
1. Go to Appwrite Console
2. Open your database → payments collection
3. You should see a new document with status "pending"

**Step 4: Complete SSLCommerz Test**
- Use SSLCommerz test credentials to complete payment
- You should be redirected to success/fail page
- Database should update with status

---

## Phase 10: Deploy to Production (1 hour)

### Option A: Deploy on Appwrite Cloud (Recommended)

Already done! Appwrite Cloud is already hosted.

### Option B: Deploy React App to Netlify

**Step 1: Build Your App**
```bash
npm run build
```

**Step 2: Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Step 3: Set Environment Variables on Netlify**
1. Go to Netlify → Site settings → Build & deploy → Environment
2. Add these variables:
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_DATABASE_ID`
   - `VITE_APPWRITE_COLLECTION_ID`
   - `VITE_APPWRITE_API_KEY`
   - `VITE_SSLCOMMERZ_STORE_ID`
   - `VITE_SSLCOMMERZ_STORE_PASSWORD`
   - `VITE_SITE_URL` (your live domain)

**Step 4: Update SSLCommerz Callbacks**
1. Go to SSLCommerz dashboard
2. Update success/fail/cancel URLs with your live domain:
   - Success: `https://your-domain.com/payment-success`
   - Fail: `https://your-domain.com/payment-fail`
   - Cancel: `https://your-domain.com/payment-cancel`

---

## Troubleshooting

### "Appwrite connection error"
- ✅ Check endpoint is correct
- ✅ Check project ID is correct
- ✅ Check CORS is enabled in Appwrite settings

### "Database not found"
- ✅ Verify database ID in .env
- ✅ Check database exists in Appwrite console

### "Collection not found"
- ✅ Verify collection ID in .env
- ✅ Check collection exists in database

### "Document not found"
- ✅ Check payment ID is being passed correctly
- ✅ Verify document was created successfully

### "SSLCommerz not redirecting"
- ✅ Check GatewayPageURL is in response
- ✅ Verify SSLCommerz API key is correct
- ✅ Check store ID and password

---

## Checklist - Complete These Steps

- [ ] Create Appwrite account (Cloud or local)
- [ ] Create project in Appwrite
- [ ] Create database named `autospark_db`
- [ ] Create collection named `payments`
- [ ] Add all attributes to collection
- [ ] Get API credentials and add to `.env`
- [ ] Install Appwrite SDK: `npm install appwrite`
- [ ] Create `src/services/appwriteService.ts`
- [ ] Update `src/pages/PaymentPage.tsx` with Appwrite integration
- [ ] Create `src/pages/PaymentSuccessPage.tsx`
- [ ] Create `src/pages/PaymentFailPage.tsx`
- [ ] Create `src/pages/PaymentCancelPage.tsx`
- [ ] Add routes to `src/App.tsx`
- [ ] Test locally with `npm run dev`
- [ ] Verify data is saved in Appwrite
- [ ] Build: `npm run build`
- [ ] Deploy to Netlify/Vercel/your server
- [ ] Test live payment flow
- [ ] Set up error monitoring (optional)

---

## Summary

**You now have:**
✅ Appwrite database for payments
✅ Payment service for saving/updating payments
✅ Callback pages for success/fail/cancel
✅ Complete integration with SSLCommerz
✅ Full payment flow working

**Total time: 3-4 hours**
**Your payment system is now fully functional!** 🎉
