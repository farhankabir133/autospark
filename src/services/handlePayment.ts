import { Client, Functions } from 'appwrite';

type OrderItem = {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
};

export type HandlePaymentInput = {
  name: string;
  phone: string;
  address: string;
  thana: string;
  district: string;
  total: number;
  items: OrderItem[];
};

type PaymentExecutionResponse = {
  success?: boolean;
  error?: string;
  data?: {
    redirectUrl?: string;
  };
};

const getRequiredEnv = () => {
  const config = {
    endpoint: (import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1').trim(),
    projectId: (import.meta.env.VITE_APPWRITE_PROJECT_ID || '').trim(),
    functionId: (import.meta.env.VITE_APPWRITE_FUNCTION_ID || '').trim(),
  };

  if (config.endpoint !== 'https://sgp.cloud.appwrite.io/v1') {
    throw new Error(
      `Invalid VITE_APPWRITE_ENDPOINT: "${config.endpoint}". Expected "https://sgp.cloud.appwrite.io/v1" for production.`
    );
  }

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        'Please set them in your local .env file and restart the dev server.'
    );
  }

  return config;
};

const parseExecutionResponse = (raw: unknown): PaymentExecutionResponse => {
  if (typeof raw !== 'string') {
    return {};
  }

  try {
    return JSON.parse(raw) as PaymentExecutionResponse;
  } catch {
    return {};
  }
};

export const handlePayment = async (orderData: HandlePaymentInput): Promise<void> => {
  const { endpoint, projectId, functionId } = getRequiredEnv();

  const client = new Client().setEndpoint(endpoint).setProject(projectId);
  const functions = new Functions(client);

  const execution = await functions.createExecution(
    functionId,
    JSON.stringify({
      path: '/payment/init',
      method: 'POST',
      body: JSON.stringify({
        customer_name: orderData.name,
        mobile: orderData.phone,
        address: orderData.address,
        thana: orderData.thana,
        district: orderData.district,
        total_amount: orderData.total,
        cart_items: JSON.stringify(orderData.items),
      }),
    })
  );

  const result = parseExecutionResponse(execution.responseBody);

  if (!result.success) {
    throw new Error(result.error || 'Payment initialization failed.');
  }

  const redirectUrl = result.data?.redirectUrl;
  if (!redirectUrl) {
    throw new Error('Payment response did not include redirectUrl.');
  }

  window.location.href = redirectUrl;
};

export const checkoutWithAppwriteExecution = handlePayment;

// Backward-compatible alias with the naming style shown in the request.
export const initiatePayment = handlePayment;
