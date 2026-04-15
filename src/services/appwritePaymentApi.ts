const resolveApiBaseUrl = (): string => {
  const explicit = (import.meta.env.VITE_SSLCOMMERZ_API_BASE_URL || '').trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const appwriteEndpoint = (import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1')
    .trim()
    .replace(/\/$/, '');

  const fromFunctionId = (import.meta.env.VITE_APPWRITE_FUNCTION_ID || '').trim();
  if (fromFunctionId) {
    return `${appwriteEndpoint}/functions/${fromFunctionId}/executions`;
  }

  const fromLegacy = (import.meta.env.VITE_PAYMENT_API_URL || '').trim();
  if (fromLegacy) return fromLegacy.replace(/\/$/, '');

  return `${appwriteEndpoint}/functions/sslcommerz-api/executions`;
};

const API_BASE_URL = resolveApiBaseUrl();
const APPWRITE_PROJECT_ID =
  (import.meta.env.VITE_APPWRITE_PROJECT_ID || '69d09ead0018cd1663a7').trim();
const IS_EXECUTION_ENDPOINT = /\/functions\/[^/]+\/executions$/i.test(API_BASE_URL);

if (!API_BASE_URL) {
  // Keep non-throwing for runtime; pages will show friendly error when called.
  console.warn('VITE_SSLCOMMERZ_API_BASE_URL is not configured');
}

type PaymentInitRequest = {
  customer_name: string;
  mobile: string;
  address: string;
  thana: string;
  district: string;
  total_amount: number;
  cart_items: string;
  cart?: Array<{ id: string; name: string; price: number; quantity: number }>;
};

type PaymentInitResponse = {
  status?: string;
  GatewayPageURL?: string;
  redirectUrl?: string;
  redirectGatewayURL?: string;
  failedreason?: string;
  error?: string;
  message?: string;
  tran_id?: string;
  data?: {
    redirectUrl?: string;
    tranId?: string;
  };
};

type AppwriteExecutionApiResponse = {
  responseStatusCode?: number;
  responseBody?: string;
  status?: string;
  message?: string;
};

export type PaymentStatusResponse = {
  status?: string;
  payment_status?: string;
  tran_id?: string;
  data?: {
    status?: string;
    tranId?: string;
  };
  success?: boolean;
  error?: string;
  message?: string;
};

const assertConfigured = () => {
  if (!API_BASE_URL) {
    throw new Error(
      'Payment API is not configured. Set VITE_SSLCOMMERZ_API_BASE_URL or VITE_APPWRITE_FUNCTION_ID.'
    );
  }
};

const getRedirectUrl = (response: PaymentInitResponse): string | undefined => {
  return (
    response.GatewayPageURL ||
    response.redirectUrl ||
    response.redirectGatewayURL ||
    response.data?.redirectUrl
  );
};

const parseJsonSafe = <T>(raw: unknown, fallback: T): T => {
  if (typeof raw !== 'string') return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const executeFunctionRoute = async <T>(
  path: string,
  method: 'GET' | 'POST',
  payload?: unknown
): Promise<{ statusCode: number; data: T }> => {
  const executionPayload = {
    async: false,
    path,
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: method === 'GET' ? '' : JSON.stringify(payload || {}),
  };

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': APPWRITE_PROJECT_ID,
    },
    body: JSON.stringify(executionPayload),
  });

  const executionResult = parseJsonSafe<AppwriteExecutionApiResponse>(await response.text(), {});

  if (!response.ok) {
    throw new Error(
      executionResult.message || `Function execution request failed (${response.status})`
    );
  }

  const statusCode = Number(executionResult.responseStatusCode || 500);
  const data = parseJsonSafe<T>(executionResult.responseBody, {} as T);

  return { statusCode, data };
};

export const appwritePaymentApi = {
  async initiatePayment(payload: PaymentInitRequest): Promise<{ redirectUrl: string; tranId?: string }> {
    assertConfigured();

    if (IS_EXECUTION_ENDPOINT) {
      const { statusCode, data } = await executeFunctionRoute<PaymentInitResponse>(
        '/payment/init',
        'POST',
        payload
      );

      if (statusCode < 200 || statusCode >= 300) {
        throw new Error(
          data.error || data.message || data.failedreason || `Payment init failed (${statusCode})`
        );
      }

      const redirectUrl = getRedirectUrl(data);
      if (!redirectUrl) {
        throw new Error(data.error || data.message || 'Payment gateway URL not found in response');
      }

      return {
        redirectUrl,
        tranId: data.tran_id || data.data?.tranId,
      };
    }

    const initEndpoints = [`${API_BASE_URL}/payment/init`, `${API_BASE_URL}/init`];

    let response: Response | null = null;
    let data: PaymentInitResponse | null = null;

    for (const endpoint of initEndpoints) {
      const currentResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let currentData: PaymentInitResponse;
      try {
        currentData = await currentResponse.json();
      } catch {
        currentData = {
          error: `Invalid response from payment server (${endpoint})`,
        };
      }

      // Treat 404 as route mismatch and try fallback endpoint.
      if (currentResponse.status === 404) {
        continue;
      }

      response = currentResponse;
      data = currentData;
      break;
    }

    if (!response || !data) {
      throw new Error('Payment API route not found. Check Appwrite Function public domain mapping.');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || data.failedreason || `Payment init failed (${response.status})`);
    }

    const redirectUrl = getRedirectUrl(data);
    if (!redirectUrl) {
      throw new Error(data.error || data.message || 'Payment gateway URL not found in response');
    }

    return {
      redirectUrl,
      tranId: data.tran_id || data.data?.tranId,
    };
  },

  async getPaymentStatus(tranId: string): Promise<PaymentStatusResponse> {
    assertConfigured();

    if (IS_EXECUTION_ENDPOINT) {
      const { statusCode, data } = await executeFunctionRoute<PaymentStatusResponse>(
        `/payment/status/${encodeURIComponent(tranId)}`,
        'GET'
      );

      if (statusCode < 200 || statusCode >= 300) {
        throw new Error(
          data.error || data.message || `Failed to fetch payment status (${statusCode})`
        );
      }

      return data;
    }

    const statusEndpoints = [
      `${API_BASE_URL}/payment/status/${encodeURIComponent(tranId)}`,
      `${API_BASE_URL}/payment?tran_id=${encodeURIComponent(tranId)}`,
    ];

    let response: Response | null = null;
    let data: PaymentStatusResponse | null = null;

    for (const endpoint of statusEndpoints) {
      const currentResponse = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let currentData: PaymentStatusResponse;
      try {
        currentData = await currentResponse.json();
      } catch {
        currentData = {
          error: `Invalid status response from payment server (${endpoint})`,
        };
      }

      // 404 likely means wrong route shape; try fallback.
      if (currentResponse.status === 404) {
        continue;
      }

      response = currentResponse;
      data = currentData;
      break;
    }

    if (!response || !data) {
      throw new Error('Payment status API route not found. Check Appwrite Function public domain mapping.');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || `Failed to fetch payment status (${response.status})`);
    }

    return data;
  },
};
