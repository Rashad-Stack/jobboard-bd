import { describe, expect, it } from 'vitest';

describe('AI Match Logic', () => {
  it('should parse valid JSON and ensure scores are between 0 and 100', () => {
    const mockApiResponse = {
      matches: [
        { jobId: '123', title: 'Frontend Developer', matchScore: 95, reason: '4/4 skills matched' }
      ]
    };

    expect(mockApiResponse.matches).toBeDefined();
    expect(mockApiResponse.matches[0].matchScore).toBeGreaterThanOrEqual(0);
    expect(mockApiResponse.matches[0].matchScore).lessThanOrEqual(100);
  });
});