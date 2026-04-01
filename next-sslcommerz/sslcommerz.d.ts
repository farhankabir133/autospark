declare module 'sslcommerz-lts' {
  class SSLCommerzPayment {
    constructor(store_id: string, store_passwd: string, is_live: boolean);
    init(): Record<string, unknown>;
    validate(data: Record<string, unknown>): Promise<any>;
  }
  export default SSLCommerzPayment;
}
