# Complete Payment Gateway Implementation Guide

## Current Status ✅

**Frontend:** ✅ READY
- Payment form component created: `src/pages/PaymentPage.tsx`
- Cart context: `src/context/CartContext.tsx`
- Accessories page with cart integration: `src/pages/AccessoriesPage.tsx`
- Form validation with React Hook Form + Zod
- Mobile number validation (BD format)

**Backend API:** ⚠️ NEEDS COMPLETION
- API endpoint structure created: `/api/payment/init.ts` (Vercel functions format)
- SSLCommerz credentials configured
- Callback handlers: success, fail, cancel
- **ISSUE:** Vercel-specific implementation - needs conversion for other platforms

---

## Step 1: Choose Your Backend Platform

### Option A: Appwrite (Recommended - Self-hosted or cloud)
**Pros:**
- Easy to set up
- Built-in authentication
- Real-time database
- Can run locally or on own server
- Can deploy to any cloud provider

**Cons:**
- Requires Docker for local setup
- More setup required than Firebase

### Option B: Firebase (Google)
**Pros:**
- Quick to set up
- Generous free tier
- Real-time database
- Good documentation

**Cons:**
- Cloud-only
- Google dependency
- Firebase-locked

### Option C: Supabase (PostgreSQL-based, open source)
**Pros:**
- PostgreSQL backend
- Open source
- Can self-host
- Good for complex queries

**Cons:**
- More complex setup
- Requires database knowledge

### Option D: Custom Node.js + Express Server
**Pros:**
- Full control
- No vendor lock-in
- Can deploy anywhere

**Cons:**
- More development required
- Server maintenance needed

---

## Step 2: Implementation by Platform

### ✅ For Appwrite (RECOMMENDED)

#### Step 2a: Install Appwrite SDK

```bash
npm install appwrite
```

#### Step 2b: Create Payment Service

Create `src/services/paymentService.ts`:

```typescript
import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export const savePaymentRequest = async (paymentData: {
  customer_name: string;
  mobile: string;
  address: string;
  thana: string;
  district: string;
  total_amount: number;
  cart_items: any[];
  session_id: string;
}) => {
  try {
    const response = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'payments',
      ID.unique(),
      {
        customer_name: paymentData.customer_name,
        mobile: paymentData.mobile,
        address: paymentData.address,
        thana: paymentData.thana,
        district: paymentData.district,
        total_amount: paymentData.total_amount,
        cart_items: JSON.stringify(paymentData.cart_items),
        session_id: paymentData.session_id,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (
  documentId: string,
  status: 'success' | 'failed' | 'cancelled',
  transactionId?: string
) => {
  try {
    const response = await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'payments',
      documentId,
      {
        status: status,
        transaction_id: transactionId || null,
        updated_at: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};
```

#### Step 2c: Update PaymentPage.tsx

Modify `src/pages/PaymentPage.tsx` to use the service:

```typescript
import { savePaymentRequest } from '../services/paymentService';

// In your form submission handler:
const handlePaymentSubmit = async (formData) => {
  try {
    // 1. Save to Appwrite
    const paymentRecord = await savePaymentRequest({
      ...formData,
      total_amount: cartTotal,
      cart_items: cartItems,
      session_id: `session_${Date.now()}`
    });

    // 2. Call SSLCommerz API
    const response = await fetch('/api/payment/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        total_amount: cartTotal,
        cart_items: cartItems,
        payment_record_id: paymentRecord.$id
      })
    });

    const result = await response.json();
    
    // 3. Redirect to SSLCommerz
    if (result.GatewayPageURL) {
      window.location.href = result.GatewayPageURL;
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};
```

#### Step 2d: Create API Endpoint for Backend

Create `src/api/payment.ts` (Node.js server or Appwrite Function):

```typescript
import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

export default async (req: any) => {
  if (req.method === 'POST') {
    const {
      customer_name,
      mobile,
      address,
      thana,
      district,
      total_amount,
      cart_items,
      payment_record_id
    } = req.body;

    try {
      // 1. Prepare SSLCommerz payload
      const sslPayload = {
        store_id: process.env.SSLCOMMERZ_STORE_ID,
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
        total_amount: total_amount,
        currency: 'BDT',
        tran_id: `TXN_${Date.now()}_${payment_record_id}`,
        success_url: `${process.env.SITE_URL}/payment-success?payment_id=${payment_record_id}`,
        fail_url: `${process.env.SITE_URL}/payment-fail?payment_id=${payment_record_id}`,
        cancel_url: `${process.env.SITE_URL}/payment-cancel?payment_id=${payment_record_id}`,
        
        // Customer info
        cust_name: customer_name,
        cust_email: 'customer@example.com', // TODO: Add email to form
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
        product_profile: 'physical-goods'
      };

      // 2. Call SSLCommerz API
      const response = await fetch('https://securepay.sslcommerz.com/gwprocess/v4/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(sslPayload).toString()
      });

      const responseText = await response.text();
      const responseData = new URLSearchParams(responseText);
      const result = {
        status: responseData.get('status'),
        GatewayPageURL: responseData.get('GatewayPageURL'),
        sessionkey: responseData.get('sessionkey')
      };

      // 3. Update payment record with session info
      if (result.GatewayPageURL) {
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          'payments',
          payment_record_id,
          {
            session_key: result.sessionkey,
            gateway_status: 'initiated'
          }
        );
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Payment error:', error);
      return { success: false, error: error.message };
    }
  }
};
```

#### Step 2e: Create Callback Handlers

Create `src/pages/PaymentSuccessPage.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { updatePaymentStatus } from '../services/paymentService';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    
    if (paymentId) {
      updatePaymentStatus(paymentId, 'success')
        .then(() => {
          setLoading(false);
        })
        .catch(error => {
          console.error('Error updating payment status:', error);
          setLoading(false);
        });
    }
  }, [searchParams]);

  if (loading) return <div>Processing payment...</div>;

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful! ✅</h1>
      <p>Your order has been received.</p>
      <a href="/accessories" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded">
        Continue Shopping
      </a>
    </div>
  );
}
```

Similar pages for `PaymentFailPage.tsx` and `PaymentCancelPage.tsx`

#### Step 2f: Set Environment Variables

Create `.env`:

```bash
# Appwrite
VITE_APPWRITE_ENDPOINT=http://localhost/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=your_database_id

# SSLCommerz
SSLCOMMERZ_STORE_ID=autosparkbd0live
SSLCOMMERZ_STORE_PASSWORD=69DBB19BAB55E48107

# Site
SITE_URL=http://localhost:5173
```

---

### ✅ For Firebase

#### Step A: Install Firebase SDK

```bash
npm install firebase
```

#### Step B: Create Firebase Service

Create `src/services/firebaseService.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const savePayment = async (paymentData: any) => {
  const docRef = await addDoc(collection(db, 'payments'), {
    ...paymentData,
    status: 'pending',
    created_at: new Date(),
  });
  return docRef.id;
};

export const updatePaymentStatus = async (docId: string, status: string) => {
  await updateDoc(doc(db, 'payments', docId), {
    status: status,
    updated_at: new Date(),
  });
};
```

#### Step C: Use in PaymentPage.tsx

```typescript
import { savePayment } from '../services/firebaseService';

// In form submission:
const paymentDocId = await savePayment({
  customer_name,
  mobile,
  address,
  thana,
  district,
  total_amount,
  cart_items: cartItems
});

// Then call SSLCommerz with payment_doc_id
```

---

## Step 3: Database Schema

### For Appwrite, Firebase, or Supabase, create a "payments" collection with:

```json
{
  "id": "unique_id",
  "customer_name": "string",
  "mobile": "string",
  "email": "string",
  "address": "string",
  "thana": "string",
  "district": "string",
  "total_amount": "number",
  "cart_items": "json array",
  "session_id": "string",
  "transaction_id": "string",
  "status": "pending|success|failed|cancelled",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## Step 4: Deployment Options

### Option A: Appwrite Self-Hosted
- Install Docker
- Run Appwrite locally or on your server
- Deploy using Docker Compose
- Can run on any cloud (AWS, DigitalOcean, etc.)

### Option B: Appwrite Cloud
- Sign up at appwrite.io
- Create project
- Get credentials
- Deploy React app on any platform (Vercel, Netlify, etc.)

### Option C: Firebase + Custom Backend
- Deploy React on Netlify/Vercel
- Deploy Node.js backend on Heroku/Railway/DigitalOcean

### Option D: DigitalOcean App Platform
- Deploy entire app (frontend + backend) on DigitalOcean
- Simple CI/CD integration with GitHub

---

## Step 5: Testing Checklist

Before going live:

- [ ] Form validation works
- [ ] Cart integration works
- [ ] Payment data saves to database
- [ ] SSLCommerz integration works
- [ ] Success callback updates database
- [ ] Fail callback updates database
- [ ] Cancel callback updates database
- [ ] Email notifications sent (optional)
- [ ] Order history page created

---

## Step 6: Going Live Checklist

- [ ] Test with real SSLCommerz account
- [ ] Set up proper error handling
- [ ] Add logging/monitoring
- [ ] Set up backup database
- [ ] Create admin dashboard to view orders
- [ ] Set up email notifications
- [ ] Test on mobile devices
- [ ] Set up SSL certificate
- [ ] Create privacy policy and terms

---

## Recommended Implementation Path

**For fastest setup:** Firebase + React
1. Time: 2-3 hours
2. Complexity: Low
3. Cost: Free tier available

**For best control:** Appwrite + React
1. Time: 3-4 hours
2. Complexity: Medium
3. Cost: Can be free (self-hosted)

**For maximum flexibility:** Custom Node.js + React
1. Time: 6-8 hours
2. Complexity: High
3. Cost: Depends on hosting

---

## Current Code You Have

✅ Already ready to use:
- `src/pages/PaymentPage.tsx` - Payment form with validation
- `src/pages/AccessoriesPage.tsx` - Cart integration
- `src/context/CartContext.tsx` - State management
- `api/payment/*` - API structure (needs conversion)

⚠️ Need to add:
- Payment service for your chosen platform
- Callback page handlers
- Database schema
- Environment variables
- Deployment configuration

---

## Quick Start: Firebase Path (30 minutes)

1. Create Firebase project at firebase.google.com
2. Get credentials
3. Add `.env` variables
4. Copy firebaseService.ts code
5. Update PaymentPage.tsx to use it
6. Test locally
7. Deploy React app to Netlify or Vercel
8. Done!

---

## Need Help?

Choose your platform and I can provide:
- Step-by-step setup instructions
- Code templates specific to your choice
- Testing and debugging help
- Deployment guides

**Which platform would you like to implement?**
1. Firebase (fastest)
2. Appwrite (most flexible)
3. Custom Node.js (maximum control)
4. Supabase (database-focused)
