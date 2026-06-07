/**
 * frontend/lib/birads.ts
 * BI-RADS (Breast Imaging Reporting and Data System) classification
 * Converts AI probability scores to BI-RADS categories with clinical recommendations
 */

/**
 * BI-RADS category information with clinical guidance
 */
export interface BIRADSInfo {
  category: 1 | 2 | 3 | 4 | 5;
  description: string;
  recommendation: string;
}

/**
 * Determines BI-RADS category based on AI probability score
 * BI-RADS Categories:
 * 1 = Negative (no findings)
 * 2 = Benign finding(s)
 * 3 = Probably benign finding(s)
 * 4 = Suspicious abnormality (further evaluation recommended)
 * 5 = Malignant finding(s)
 *
 * @param probability - Probability of malignancy (0.0 to 1.0)
 * @returns BIRADSInfo with category, description, and recommendation
 */
export function determineBIRADS(probability: number): BIRADSInfo {
  // Ensure probability is between 0 and 1
  const normalizedProbability = Math.max(0, Math.min(1, probability));

  if (normalizedProbability < 0.02) {
    return {
      category: 1,
      description: 'Negative. No significant findings.',
      recommendation: 'Continue routine screening mammography as clinically appropriate.',
    };
  }

  if (normalizedProbability < 0.1) {
    return {
      category: 2,
      description: 'Benign finding(s). No malignancy suspected.',
      recommendation: 'Routine mammographic follow-up. Return to screening in 1-2 years.',
    };
  }

  if (normalizedProbability < 0.5) {
    return {
      category: 3,
      description: 'Probably benign finding(s). Low suspicion for malignancy.',
      recommendation: 'Short-term mammographic follow-up in 3-6 months, or diagnostic evaluation as clinically appropriate.',
    };
  }

  if (normalizedProbability < 0.95) {
    return {
      category: 4,
      description: 'Suspicious abnormality. Further evaluation recommended.',
      recommendation: 'Diagnostic imaging evaluation and possible tissue diagnosis (biopsy) required.',
    };
  }

  // >= 0.95
  return {
    category: 5,
    description: 'Malignant finding(s) suspected. High probability of malignancy.',
    recommendation: 'Immediate diagnostic work-up and tissue diagnosis (biopsy) strongly recommended.',
  };
}

/**
 * Gets color for BI-RADS category display
 * Used to highlight probability scores and category badges
 * @param biRads - BI-RADS category (1-5)
 * @returns Hex color code
 */
export function getBIRADSColor(biRads: 1 | 2 | 3 | 4 | 5): string {
  // Categories 1-3: Low risk (Calm Blue)
  if (biRads <= 3) {
    return '#3B82F6'; // Calm Blue
  }
  // Categories 4-5: High risk (Muted Rose)
  return '#BE123C'; // Muted Rose
}
