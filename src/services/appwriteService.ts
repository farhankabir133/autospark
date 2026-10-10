import { Client, Databases, ID, Query } from 'appwrite';
import { env } from '../lib/env';

// No hardcoded fallbacks: env.ts throws in PROD when required vars are missing.
const APPWRITE_ENDPOINT = env.VITE_APPWRITE_ENDPOINT as string;
const APPWRITE_PROJECT_ID = env.VITE_APPWRITE_PROJECT_ID as string;
const DATABASE_ID = env.VITE_APPWRITE_DATABASE_ID as string;
const COLLECTION_ID = env.VITE_APPWRITE_COLLECTION_ID as string;

function assertAppwriteEnv() {
  const missing: string[] = [];
  if (!APPWRITE_ENDPOINT) missing.push('VITE_APPWRITE_ENDPOINT');
  if (!APPWRITE_PROJECT_ID) missing.push('VITE_APPWRITE_PROJECT_ID');
  if (!DATABASE_ID) missing.push('VITE_APPWRITE_DATABASE_ID');
  if (!COLLECTION_ID) missing.push('VITE_APPWRITE_COLLECTION_ID');
  if (missing.length) throw new Error(`Missing Appwrite env: ${missing.join(', ')}. Check .env`);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

// Save payment request to database
export const savePaymentRequest = async (paymentData: {
  customer_name: string;
  mobile: string;
  email?: string;
  address: string;
  thana: string;
  district: string;
  total_amount: number;
  cart_items: any[];
}) => {
  assertAppwriteEnv();
  try {
    // A-03 fix: secure session id + idempotent stringify (avoid double-encoding)
    const sessionId = `session_${(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2,8)}`)}`;
    const cartPayload = typeof paymentData.cart_items === 'string' ? paymentData.cart_items : JSON.stringify(paymentData.cart_items);
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        customer_name: paymentData.customer_name,
        mobile: paymentData.mobile,
        email: paymentData.email ?? null,
        address: paymentData.address,
        thana: paymentData.thana,
        district: paymentData.district,
        total_amount: paymentData.total_amount,
        cart_items: cartPayload,
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
  assertAppwriteEnv();
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      {
        status: status,
        transaction_id: transactionId || null,
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
  assertAppwriteEnv();
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

// Get all payments — cursor pagination (preferred over offset)
export const getAllPayments = async (limit = 25, cursorAfter?: string) => {
  assertAppwriteEnv();
  try {
    const queries = [Query.limit(Math.min(limit, 100)), Query.orderDesc('$createdAt'), Query.select(['$id', 'status', 'total_amount', 'session_id', 'transaction_id', '$createdAt'])];
    if (cursorAfter) queries.push(Query.cursorAfter(cursorAfter));
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
    return response;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};
