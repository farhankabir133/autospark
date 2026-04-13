# ✅ Appwrite Configuration Complete

## Your Appwrite Credentials Are Set! 🎉

Your `.env` file has been updated with:

```
VITE_APPWRITE_PROJECT_ID="69d09ead0018cd1663a7"
VITE_APPWRITE_ENDPOINT="https://sgp.cloud.appwrite.io/v1"
VITE_APPWRITE_API_KEY="standard_9acdd3b91411d3e773df9b06620e35d7410660982c39cd1848b008752a063a078843d1c1bf7176583c3b4bcd162ec3da6f78025641bcb1164db16bd53bb92d6e9f815a9bd9f06f491d29dccbfc1a5d0ec0d7ee386eb6b3e1224577a79b9326b5a7fd40e76428a6c949a44976d5266c2dbf150048db2b2a2e580d2cdffbd682f2"
VITE_APPWRITE_DATABASE_ID="autospark_db"
VITE_APPWRITE_COLLECTION_ID="payments"
```

---

## Next: Create Payment Service File

Now you need to create the payment service that uses these credentials.

### Step 1: Create the File

Create a new file: `src/services/appwriteService.ts`

Copy this code:

```typescript
import { Client, Databases, ID } from 'appwrite';

// Initialize Appwrite client with your credentials
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

    console.log('✅ Payment saved to database:', response);
    return response;
  } catch (error) {
    console.error('❌ Error saving payment:', error);
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

    console.log('✅ Payment updated:', response);
    return response;
  } catch (error) {
    console.error('❌ Error updating payment:', error);
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
    console.log('✅ Payment retrieved:', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching payment:', error);
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
    console.log('✅ Payments retrieved:', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    throw error;
  }
};
```

---

## Next: Install Appwrite SDK

Run this command in terminal:

```bash
npm install appwrite
```

---

## Next: Update PaymentPage.tsx

See **APPWRITE_SETUP_GUIDE.md** → "Phase 5: Update PaymentPage.tsx"

Key changes:
1. Import the service: `import { savePaymentRequest } from '../services/appwriteService';`
2. Update form submission to call `savePaymentRequest()`
3. Pass the document ID to SSLCommerz API

---

## Verify Configuration

Your setup is complete when:

✅ `.env` has all Appwrite credentials
✅ Appwrite SDK installed (`npm install appwrite`)
✅ `src/services/appwriteService.ts` created
✅ `PaymentPage.tsx` updated with service integration

---

## Quick Test

To verify Appwrite is working, run:

```bash
npm run dev
```

Then check browser console when you submit payment form. You should see:
- ✅ "Payment saved to database: {...}"

---

## What's Next?

Follow this order:
1. ✅ Add credentials to `.env` (DONE)
2. ⏳ Create `appwriteService.ts` (copy code above)
3. ⏳ Install Appwrite SDK: `npm install appwrite`
4. ⏳ Update `PaymentPage.tsx` to use service
5. ⏳ Create callback pages (success/fail/cancel)
6. ⏳ Add routes to your app
7. ⏳ Test locally
8. ⏳ Deploy to production

See **APPWRITE_SETUP_GUIDE.md** for detailed instructions on each step.
