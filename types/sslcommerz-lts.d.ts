declare module 'sslcommerz-lts' {
  interface InitData {
    store_id: string;
    store_passwd: string;
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url: string;
    cus_name?: string;
    cus_email?: string;
    cus_phone?: string;
    cus_add1?: string;
    cus_add2?: string;
    cus_city?: string;
    cus_state?: string;
    cus_postcode?: string;
    cus_country?: string;
    ship_name?: string;
    ship_add1?: string;
    ship_add2?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string;
    ship_country?: string;
    product_name?: string;
    product_category?: string;
    product_profile?: string;
    value_a?: string;
    value_b?: string;
    value_c?: string;
    value_d?: string;
    [key: string]: any;
  }

  interface ValidationData {
    validator_id: number;
    store_passwd: string;
    tran_id: string;
    amount: number;
    card_type: string;
  }

  interface ValidationResult {
    status: string;
    tran_id: string;
    amount: number;
    currency: string;
    [key: string]: any;
  }

  class SSLCommerzPayment {
    constructor(
      isSandboxMode: boolean,
      storeId: string,
      storePassword: string
    );
    
    init(data: InitData): Promise<{ GatewayPageURL: string; [key: string]: any }>;
    
    validate(data: ValidationData): Promise<ValidationResult>;
  }

  export default SSLCommerzPayment;
}
