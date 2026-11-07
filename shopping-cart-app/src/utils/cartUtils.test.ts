import { describe, it, expect } from 'vitest';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  formatCurrency,
  isValidQuantity,
  type CartItem,
} from './cartUtils';

describe('cartUtils', () => {
  describe('calculateItemTotal', () => {
    it('should correctly calculate total for an item with quantity 1', () => {
      const item: CartItem = { id: 1, name: 'Apple', price: 2.5, quantity: 1 };
      expect(calculateItemTotal(item)).toBe(2.5);
    });

    it('should correctly calculate total for an item with multiple quantities', () => {
      const item: CartItem = { id: 1, name: 'Apple', price: 2.5, quantity: 4 };
      expect(calculateItemTotal(item)).toBe(10);
    });

    it('should return 0 if quantity is 0', () => {
      const item: CartItem = { id: 1, name: 'Apple', price: 2.5, quantity: 0 };
      expect(calculateItemTotal(item)).toBe(0);
    });
  });

  describe('calculateSubtotal', () => {
    it('should return 0 for an empty cart', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('should correctly sum up multiple items in the cart', () => {
      const items: CartItem[] = [
        { id: 1, name: 'Apple', price: 2.0, quantity: 3 },
        { id: 2, name: 'Banana', price: 1.5, quantity: 2 },
      ];
      // (2.0 * 3) + (1.5 * 2) = 6.0 + 3.0 = 9.0
      expect(calculateSubtotal(items)).toBe(9.0);
    });
  });

  describe('calculateDiscount', () => {
    it('should return 0 discount for subtotal under $50', () => {
      expect(calculateDiscount(45)).toBe(0);
      expect(calculateDiscount(0)).toBe(0);
    });

    it('should return 5% discount for subtotal between $50 and $99.99', () => {
      expect(calculateDiscount(50)).toBe(2.5); // 50 * 0.05
      expect(calculateDiscount(80)).toBe(4);   // 80 * 0.05
    });

    it('should return 10% discount for subtotal of $100 or more', () => {
      expect(calculateDiscount(100)).toBe(10);  // 100 * 0.1
      expect(calculateDiscount(250)).toBe(25);  // 250 * 0.1
    });
  });

  describe('calculateTax', () => {
    it('should calculate 8% tax correctly', () => {
      expect(calculateTax(100)).toBeCloseTo(8);
      expect(calculateTax(50)).toBeCloseTo(4);
    });

    it('should return 0 tax for 0 amount', () => {
      expect(calculateTax(0)).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate final total including subtotal, discount, and tax correctly', () => {
      const items: CartItem[] = [
        { id: 1, name: 'Laptop', price: 120, quantity: 1 },
      ];
      // Subtotal: 120
      // Discount (>= 100): 120 * 0.1 = 12
      // After discount: 108
      // Tax (8% of 108): 8.64
      // Final Total: 108 + 8.64 = 116.64
      expect(calculateTotal(items)).toBe(116.64);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers into standard currency string with 2 decimal places', () => {
      expect(formatCurrency(5)).toBe('$5.00');
      expect(formatCurrency(19.99)).toBe('$19.99');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('isValidQuantity', () => {
    it('should return true for positive integers', () => {
      expect(isValidQuantity(1)).toBe(true);
      expect(isValidQuantity(10)).toBe(true);
    });

    it('should return false for zero or negative numbers', () => {
      expect(isValidQuantity(0)).toBe(false);
      expect(isValidQuantity(-3)).toBe(false);
    });

    it('should return false for floating-point numbers', () => {
      expect(isValidQuantity(2.5)).toBe(false);
    });
  });
});