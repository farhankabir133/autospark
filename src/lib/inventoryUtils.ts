/**
 * Inventory Management Utilities
 * Provides functions for stock status, validation, and display
 */

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface StockInfo {
  status: StockStatus;
  label: string;
  color: 'green' | 'yellow' | 'red';
  icon: 'check' | 'alert' | 'x';
  canPurchase: boolean;
  quantity: number;
  percentage: number;
}

/**
 * Get stock status based on quantity
 * - In Stock: > 10 items
 * - Low Stock: 1-10 items
 * - Out of Stock: 0 items
 */
export const getStockStatus = (quantity: number): StockInfo => {
  const percentage = Math.min((quantity / 100) * 100, 100);

  if (quantity <= 0) {
    return {
      status: 'out-of-stock',
      label: 'Out of Stock',
      color: 'red',
      icon: 'x',
      canPurchase: false,
      quantity: 0,
      percentage: 0,
    };
  }

  if (quantity <= 10) {
    return {
      status: 'low-stock',
      label: `Only ${quantity} Left!`,
      color: 'yellow',
      icon: 'alert',
      canPurchase: true,
      quantity,
      percentage,
    };
  }

  return {
    status: 'in-stock',
    label: 'In Stock',
    color: 'green',
    icon: 'check',
    canPurchase: true,
    quantity,
    percentage,
  };
};

/**
 * Validate if a product can be added to cart
 */
export const canAddToCart = (
  productQuantity: number,
  requestedQuantity: number
): { valid: boolean; error?: string } => {
  if (productQuantity <= 0) {
    return {
      valid: false,
      error: 'This product is out of stock',
    };
  }

  if (requestedQuantity > productQuantity) {
    return {
      valid: false,
      error: `Only ${productQuantity} item(s) available in stock`,
    };
  }

  return { valid: true };
};

/**
 * Get color class for stock status (Tailwind)
 */
export const getStockColorClass = (status: StockStatus, isDark: boolean): string => {
  const colorMap: Record<StockStatus, { dark: string; light: string }> = {
    'in-stock': {
      dark: 'text-green-400 bg-green-500/10',
      light: 'text-green-600 bg-green-50',
    },
    'low-stock': {
      dark: 'text-yellow-400 bg-yellow-500/10',
      light: 'text-yellow-600 bg-yellow-50',
    },
    'out-of-stock': {
      dark: 'text-red-400 bg-red-500/10',
      light: 'text-red-600 bg-red-50',
    },
  };

  return isDark ? colorMap[status].dark : colorMap[status].light;
};

/**
 * Get badge styling for product cards
 */
export const getStockBadgeClass = (status: StockStatus, isDark: boolean): string => {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-bold';
  const colorMap: Record<StockStatus, string> = {
    'in-stock': isDark ? 'bg-green-500 text-white' : 'bg-green-500 text-white',
    'low-stock': isDark ? 'bg-yellow-500 text-white' : 'bg-yellow-500 text-white',
    'out-of-stock': isDark ? 'bg-red-500 text-white' : 'bg-red-500 text-white',
  };

  return `${baseClass} ${colorMap[status]}`;
};

/**
 * Format stock message for display
 */
export const formatStockMessage = (info: StockInfo): string => {
  switch (info.status) {
    case 'in-stock':
      return `${info.quantity} items in stock`;
    case 'low-stock':
      return info.label;
    case 'out-of-stock':
      return 'Currently unavailable';
    default:
      return 'Unknown stock status';
  }
};
