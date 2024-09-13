import * as module from 'node:module';

import { describe, expect, it } from 'vitest';

const require = module.createRequire(import.meta.url);

const stats = require('../index.cjs');

describe('sum', () => {
  it('should return NaN for an empty array', () => {
    expect(Number.isNaN(stats.sum(new Float64Array([])))).toBe(true);
  });
  it('should return the correct sum for a non-empty array', () => {
    expect(stats.sum(new Float64Array([1, 2, 3]))).toBe(6);
  });
});

describe('mean', () => {
  it('should return NaN for an empty array', () => {
    expect(Number.isNaN(stats.mean(new Float64Array([])))).toBe(true);
  });
  it('should return the correct mean for a non-empty array', () => {
    expect(stats.mean(new Float64Array([1, 2, 3, 4, 5]))).toBe(3);
  });
});

describe('std', () => {
  it('should return NaN for an array of only one number', () => {
    expect(Number.isNaN(stats.std(new Float64Array([1])))).toBe(true);
  });
  it('should return the correct sample standard deviation for a non-empty array', () => {
    expect(stats.std(new Float64Array([1, 2, 3, 4, 5])).toFixed(5)).toBe((1.5811388).toFixed(5));
  });
  it('should return the correct population standard deviation for a non-empty array', () => {
    expect(stats.std(new Float64Array([1, 2, 3, 4, 5]), { isPopulation: true }).toFixed(5)).toBe(
      (1.4142136).toFixed(5)
    );
  });
});

describe('linearRegression', () => {
  it('should throw if the lengths of the arrays are not equal', () => {
    expect(() => {
      stats.linearRegression(new Float64Array([1, 2, 3, 4]), new Float64Array([1, 2, 3]));
    }).toThrow("Expected length of 'x' and 'y' to be equal: 4 != 3");
  });
  it('should throw if there are only two data points', () => {
    expect(() => {
      stats.linearRegression(new Float64Array([1, 2]), new Float64Array([1, 2]));
    }).toThrow('Regression model must include at least 3 points, found 2');
  });
  it('should compute a very simple model', () => {
    const x = new Float64Array([1, 2, 3]);
    const y = new Float64Array([2, 3, 4]);
    expect(stats.linearRegression(x, y)).toMatchObject({
      intercept: 1,
      slope: 1,
      stdErr: 0
    });
  });
  it('should compute a model where the fit is imperfect', () => {
    const x = new Float64Array([1, 2, 3]);
    const y = new Float64Array([2, 3, 5]);
    const result = stats.linearRegression(x, y);
    expect(result.intercept).toBeCloseTo(0.333);
    expect(result.slope).toBeCloseTo(1.5);
    expect(result.stdErr).toBeCloseTo(0.288);
  });
});
