type JsonRecord = Record<string, unknown>;

export interface PaymentCartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface StartPaymentInput {
  customer_name: string;
  mobile: string;
  email?: string;
  address: string;
  thana: string;
  district: string;
  cart_items: PaymentCartItem[];
  total_amount: number;
}

export interface StartPaymentResult {
  redirectUrl: string;
}

export interface PaymentStatusResult {
  status: string;
  gateway_status?: string | null;
  transaction_id?: string | null;
  session_id?: string | null;
  total_amount?: number | null;
}

function requiredEnv(name: string): string {
  const v = (import.meta as unknown as { env: Record<string, string | undefined> }).env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

function getApiBaseUrl(): string {
  // Your Appwrite Function is deployed as a separate service (“sslcommerz-api”).
  // Put that public base URL in Vercel as: VITE_SSLCOMMERZ_API_BASE_URL
  // Example (depends on your Appwrite deployment domain): https://<your-function-domain>
  return requiredEnv('VITE_SSLCOMMERZ_API_BASE_URL').replace(/\/$/, '');
}

async function postJson<TResponse>(path: string, body: JsonRecord): Promise<TResponse> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    const msg = (json as { message?: string; error?: string })?.message || (json as { error?: string })?.error;
    throw new Error(msg || `Request failed (${res.status})`);
  }

  return json as TResponse;
}

async function getJson<TResponse>(pathWithQuery: string): Promise<TResponse> {
  const url = `${getApiBaseUrl()}${pathWithQuery.startsWith('/') ? '' : '/'}${pathWithQuery}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    const msg = (json as { message?: string; error?: string })?.message || (json as { error?: string })?.error;
    throw new Error(msg || `Request failed (${res.status})`);
  }

  return json as TResponse;
}

export const appwritePaymentApi = {
  /**
   * Starts an SSLCommerz payment session.
   * Your Appwrite function should:
   * 1) create a row in the Appwrite `payments` collection
   * 2) call SSLCommerz session API
   * 3) return { paymentId, gatewayPageURL }
   */
  startPayment: async (input: StartPaymentInput): Promise<StartPaymentResult> => {
    return postJson<StartPaymentResult>('/init', {
      total_amount: input.total_amount,
      cus_name: input.customer_name,
      cus_email: input.email,
      cus_phone: input.mobile,
      mobile: input.mobile,
      address: input.address,
      thana: input.thana,
      district: input.district,
      cart_items: input.cart_items,
    });
  },

  /**
   * Checks payment status based on an internal paymentId/session/transaction ID.
   * Your Appwrite function should verify with SSLCommerz validation API and update DB.
   */
  getPaymentStatus: async (query: { tran_id: string }): Promise<PaymentStatusResult> => {
    const qs = new URLSearchParams({ tran_id: query.tran_id });
    return getJson<PaymentStatusResult>(`/payment?${qs.toString()}`);
  },
};
