/**
 * Tests for MathOptimizer.solveMath
 *
 * These lock the return-type contract that App.js relies on: a valid
 * expression yields a finite number, while an unparseable one yields an
 * "Error: ..." string (which the caller must not present as a result).
 */

import MathOptimizer from './MathOptimizer';

describe('MathOptimizer.solveMath', () => {
  const optimizer = new MathOptimizer();

  test('returns a finite number for a valid expression', () => {
    expect(optimizer.solveMath('2 plus 2')).toBe(4);
    expect(optimizer.solveMath('10 times 3')).toBe(30);
  });

  test('returns an "Error" string for an unparseable expression', () => {
    const result = optimizer.solveMath('apples plus oranges');
    expect(typeof result).toBe('string');
    expect(result.startsWith('Error')).toBe(true);
  });

  test('recognizeMath flags word-operator-word input that solveMath cannot evaluate', () => {
    // This is the case that previously surfaced an "Error: ..." string to the
    // user as a "Math detected!" result with 100% savings.
    expect(optimizer.recognizeMath('apples plus oranges')).toBe(true);
    expect(typeof optimizer.solveMath('apples plus oranges')).toBe('string');
  });
});
