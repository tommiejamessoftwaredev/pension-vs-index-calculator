import { formatCurrency, formatPercentage } from './formatters';

describe('formatCurrency', () => {
  it('should format positive numbers as GBP currency', () => {
    expect(formatCurrency(1000)).toBe('£1,000');
    expect(formatCurrency(50000)).toBe('£50,000');
    expect(formatCurrency(1234567)).toBe('£1,234,567');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('£0');
  });

  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-1000)).toBe('-£1,000');
  });

  it('should handle decimal numbers by rounding', () => {
    expect(formatCurrency(1000.99)).toBe('£1,001');
    expect(formatCurrency(1000.49)).toBe('£1,000');
  });
});

describe('formatPercentage', () => {
  it('should format positive percentages', () => {
    expect(formatPercentage(5)).toBe('5%');
    expect(formatPercentage(10.5)).toBe('10.5%');
    expect(formatPercentage(100)).toBe('100%');
  });

  it('should format zero percentage', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  it('should format negative percentages', () => {
    expect(formatPercentage(-5)).toBe('-5%');
  });

  it('should handle decimal percentages', () => {
    expect(formatPercentage(2.75)).toBe('2.75%');
  });
});