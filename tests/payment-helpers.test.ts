import { describe, expect, it } from 'vitest';
import { validateInitPayload, corsOrigin, newTranId } from '../../api/payment/_helpers';

describe('validateInitPayload', () => {
  const base = {
    cart: [{ price: 1000, qty: 2, name: 'Brake Pad' }],
    total_amount: 2000,
    customer_name: 'Rahim Uddin',
    mobile: '01712345678',
    address: 'House 12, Road 5',
    thana: 'Rajpara',
    district: 'Rajshahi',
  };
  it('accepts valid payload', () => {
    expect(validateInitPayload(base).ok).toBe(true);
  });
  it('rejects bad phone', () => {
    expect(validateInitPayload({ ...base, mobile: '123' }).ok).toBe(false);
  });
  it('rejects amount mismatch', () => {
    expect(validateInitPayload({ ...base, total_amount: 500 }).ok).toBe(false);
  });
  it('rejects out-of-range amount', () => {
    expect(validateInitPayload({ ...base, total_amount: 5 }).ok).toBe(false);
  });
});

describe('corsOrigin', () => {
  it('allows known origins, falls back otherwise', () => {
    expect(corsOrigin('https://autosparkbd.com')).toBe('https://autosparkbd.com');
    expect(corsOrigin('https://evil.com')).toBe('https://autosparkbd.com');
  });
});

describe('newTranId', () => {
  it('generates unique ids', () => {
    expect(newTranId()).not.toBe(newTranId());
  });
});
