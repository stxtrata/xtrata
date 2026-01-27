import { describe, expect, it } from 'vitest';
import { formatBytes, truncateMiddle } from '../format';

describe('format helpers', () => {
  it('truncates long strings', () => {
    expect(truncateMiddle('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA')).toBe(
      'ST10W2...V2E7YA'
    );
  });

  it('formats byte counts', () => {
    expect(formatBytes(512n)).toBe('512 B');
    expect(formatBytes(2048n)).toBe('2.0 KB');
  });
});
