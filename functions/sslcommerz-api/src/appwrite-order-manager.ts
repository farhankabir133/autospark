/**
 * Auto Spark - SSLCommerz Payment Integration
 * Appwrite Database Integration
 * 
 * Handles order document management in Appwrite Databases.
 */

import type { Order } from './types';
import { logPaymentEvent, handleError, formatTimestamp } from './utils';

/**
 * AppwriteOrderManager class handles order operations in Appwrite
 */
export class AppwriteOrderManager {
  private client: any;
  private databaseId: string;
  private collectionId: string;
  private logFn?: (message: string) => void;
  private errorFn?: (message: string) => void;

  /**
   * Initialize the AppwriteOrderManager
   * 
   * @param {any} client - Initialized Appwrite client
   * @param {string} databaseId - Appwrite Database ID
   * @param {string} collectionId - Appwrite Collection ID for orders
   * @param {object} options - Additional options
   */
  constructor(
    client: any,
    databaseId: string,
    collectionId: string,
    options?: {
      logFn?: (message: string) => void;
      errorFn?: (message: string) => void;
    }
  ) {
    this.client = client;
    this.databaseId = databaseId;
    this.collectionId = collectionId;
    this.logFn = options?.logFn;
    this.errorFn = options?.errorFn;
  }

  /**
   * Creates a new order document in Appwrite
   * 
   * @param {string} orderId - Unique order ID (usually transaction ID)
   * @param {Record<string, any>} orderData - Order document data
   * @returns {Promise<object>} Created order document
   * 
   * @example
   * const order = await manager.createOrder('AS_LIVE_123_xyz', {
   *   tran_id: 'AS_LIVE_123_xyz',
   *   status: 'pending',
   *   amount: 50000,
   *   ...
   * });
   */
  async createOrder(orderId: string, orderData: Record<string, any>): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    try {
      logPaymentEvent('order_create_start', { orderId, amount: orderData.amount }, this.logFn);

      const db = this.client.databases.get(this.databaseId);
      const response = await db.createDocument(
        this.collectionId,
        orderId,
        orderData
      );

      logPaymentEvent('order_created', {
        orderId,
        status: response.status || 'pending',
        amount: response.amount
      }, this.logFn);

      return {
        success: true,
        data: response as Order
      };
    } catch (error) {
      const result = handleError(error as Error | string, 'AppwriteOrderManager.createOrder', this.errorFn);
      return {
        success: false,
        error: result.error
      };
    }
  }

  /**
   * Retrieves an order document by transaction ID
   * 
   * @param {string} tranId - Transaction ID
   * @returns {Promise<object>} Order document
   */
  async getOrder(tranId: string): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    try {
      logPaymentEvent('order_retrieve_start', { tranId }, this.logFn);

      const db = this.client.databases.get(this.databaseId);
      const response = await db.getDocument(this.collectionId, tranId);

      logPaymentEvent('order_retrieved', {
        tranId,
        status: response.status,
        amount: response.amount
      }, this.logFn);

      return {
        success: true,
        data: response as Order
      };
    } catch (error) {
      const result = handleError(error as Error | string, 'AppwriteOrderManager.getOrder', this.errorFn);
      return {
        success: false,
        error: result.error
      };
    }
  }

  /**
   * Updates order status to 'paid' after successful payment validation
   * 
   * @param {string} tranId - Transaction ID
   * @param {object} updateData - Data to update (validation_id, payment_method, etc.)
   * @returns {Promise<object>} Updated order document
   * 
   * @example
   * const updated = await manager.markOrderAsPaid('AS_LIVE_123_xyz', {
   *   validation_id: 'VAL_123_xyz',
   *   payment_method: 'card',
   *   paid_at: new Date().toISOString()
   * });
   */
  async markOrderAsPaid(
    tranId: string,
    updateData?: Record<string, any>
  ): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    try {
      logPaymentEvent('order_update_start', { tranId, status: 'paid' }, this.logFn);

      const updatePayload = {
        status: 'paid',
        paid_at: new Date().toISOString(),
        ...updateData
      };

      const db = this.client.databases.get(this.databaseId);
      const response = await db.updateDocument(
        this.collectionId,
        tranId,
        updatePayload
      );

      logPaymentEvent('order_marked_paid', {
        tranId,
        validationId: updateData?.validation_id,
        amount: response.amount
      }, this.logFn);

      return {
        success: true,
        data: response as Order
      };
    } catch (error) {
      const result = handleError(error as Error | string, 'AppwriteOrderManager.markOrderAsPaid', this.errorFn);
      return {
        success: false,
        error: result.error
      };
    }
  }

  /**
   * Updates order status to 'failed'
   * 
   * @param {string} tranId - Transaction ID
   * @param {string} errorMessage - Error message
   * @returns {Promise<object>} Updated order document
   */
  async markOrderAsFailed(
    tranId: string,
    errorMessage?: string
  ): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    try {
      logPaymentEvent('order_mark_failed_start', { tranId, error: errorMessage }, this.logFn);

      const updatePayload: any = {
        status: 'failed'
      };

      if (errorMessage) {
        updatePayload.metadata = {
          error: errorMessage,
          failed_at: new Date().toISOString()
        };
      }

      const db = this.client.databases.get(this.databaseId);
      const response = await db.updateDocument(
        this.collectionId,
        tranId,
        updatePayload
      );

      logPaymentEvent('order_marked_failed', { tranId }, this.logFn);

      return {
        success: true,
        data: response as Order
      };
    } catch (error) {
      const result = handleError(error as Error | string, 'AppwriteOrderManager.markOrderAsFailed', this.errorFn);
      return {
        success: false,
        error: result.error
      };
    }
  }

  /**
   * Updates order status to 'cancelled'
   * 
   * @param {string} tranId - Transaction ID
   * @returns {Promise<object>} Updated order document
   */
  async markOrderAsCancelled(tranId: string): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    try {
      logPaymentEvent('order_cancel_start', { tranId }, this.logFn);

      const updatePayload = {
        status: 'cancelled',
        metadata: {
          cancelled_at: new Date().toISOString()
        }
      };

      const db = this.client.databases.get(this.databaseId);
      const response = await db.updateDocument(
        this.collectionId,
        tranId,
        updatePayload
      );

      logPaymentEvent('order_cancelled', { tranId }, this.logFn);

      return {
        success: true,
        data: response as Order
      };
    } catch (error) {
      const result = handleError(error as Error | string, 'AppwriteOrderManager.markOrderAsCancelled', this.errorFn);
      return {
        success: false,
        error: result.error
      };
    }
  }

  /**
   * Lists all orders with optional filtering
   * 
   * @param {object} options - Query options
   * @returns {Promise<object>} List of orders
   */
  async listOrders(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    success: boolean;
    data?: Order[];
    total?: number;
    error?: string;
  }> {
    try {
      const db = this.client.databases.get(this.databaseId);
      const queries: any[] = [];

      if (options?.status) {
        queries.push(`equal("status", "${options.status}")`);
      }

      const response = await db.listDocuments(
        this.collectionId,
        queries,
        options?.limit || 25,
        options?.offset || 0
      );

      return {
        success: true,
        data: response.documents as Order[],
        total: response.total
      };
    } catch (error) {
      const result = handleError(error as Error | string, 'AppwriteOrderManager.listOrders', this.errorFn);
      return {
        success: false,
        error: result.error
      };
    }
  }

  /**
   * Gets order statistics
   * 
   * @returns {Promise<object>} Order statistics
   */
  async getOrderStats(): Promise<{
    success: boolean;
    stats?: {
      total: number;
      pending: number;
      paid: number;
      failed: number;
      cancelled: number;
    };
    error?: string;
  }> {
    try {
      const pendingResult = await this.listOrders({ status: 'pending' });
      const paidResult = await this.listOrders({ status: 'paid' });
      const failedResult = await this.listOrders({ status: 'failed' });
      const cancelledResult = await this.listOrders({ status: 'cancelled' });

      return {
        success: true,
        stats: {
          total: (pendingResult.total || 0) + (paidResult.total || 0) + (failedResult.total || 0) + (cancelledResult.total || 0),
          pending: pendingResult.total || 0,
          paid: paidResult.total || 0,
          failed: failedResult.total || 0,
          cancelled: cancelledResult.total || 0
        }
      };
    } catch (error) {
      const result = handleError(error as Error | string, 'AppwriteOrderManager.getOrderStats', this.errorFn);
      return {
        success: false,
        error: result.error
      };
    }
  }
}
