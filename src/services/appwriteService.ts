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
