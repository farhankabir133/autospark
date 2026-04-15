const resolveApiBaseUrl = (): string => {
  const explicit = (import.meta.env.VITE_SSLCOMMERZ_API_BASE_URL || '').trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const fromFunctionId = (import.meta.env.VITE_APPWRITE_FUNCTION_ID || '').trim();
  if (fromFunctionId) {
    return `https://${fromFunctionId}.appwrite.global`;
  }

  const fromLegacy = (import.meta.env.VITE_PAYMENT_API_URL || '').trim();
  if (fromLegacy) return fromLegacy.replace(/\/$/, '');

  return '';
};

const API_BASE_URL = resolveApiBaseUrl();

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

export const appwritePaymentApi = {
  async initiatePayment(payload: PaymentInitRequest): Promise<{ redirectUrl: string; tranId?: string }> {
    assertConfigured();

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
