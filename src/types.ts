// A-01 fix: single source of truth — re-export from src/types/index.ts to avoid drift
// This file kept for backwards compat; prefer `import type { Vehicle } from '../types/index'` or `from '../types'`
export type { Vehicle, VehicleImage, VehicleFeature, Product, ProductImage, Language, Testimonial, ServiceAppointment, TradeInRequest, CartItem, Order } from './types/index';
