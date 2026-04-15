const API_BASE_URL = (import.meta.env.VITE_SSLCOMMERZ_API_BASE_URL || '').replace(/\/$/, '');

if (!API_BASE_URL) {
  // Keep non-throwing for runtime; pages will show friendly error when called.
  // eslint-disable-next-line no-console
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
    throw new Error('Payment API is not configured. Missing VITE_SSLCOMMERZ_API_BASE_URL');
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

    const response = await fetch(`${API_BASE_URL}/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data: PaymentInitResponse;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid response from payment server');
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

    const response = await fetch(`${API_BASE_URL}/payment?tran_id=${encodeURIComponent(tranId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data: PaymentStatusResponse;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid status response from payment server');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || `Failed to fetch payment status (${response.status})`);
    }

    return data;
  },
};
