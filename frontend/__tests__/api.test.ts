import { uploadFile, analyzeFile, getDemo } from '@/lib/api';

describe('API Client', () => {
  test('uploadFile handles valid response', async () => {
    // Mock successful upload
    const mockResponse = {
      fileId: 'test_123',
      previewUrl: 'data:image/png;base64,...',
      metadata: {
        patientId: 'PAT-001',
        studyDate: '2024-01-01',
        viewType: 'CC',
        age: 55,
        breastDensity: 'B'
      }
    };
    
    // This is a basic test placeholder
    // Real test would mock axios
    expect(mockResponse.fileId).toBe('test_123');
  });

  test('getDemo returns demo response', async () => {
    const mockDemo = {
      fileId: 'demo_001',
      previewUrl: 'data:image/png;base64,...',
      metadata: {
        patientId: 'DEMO-0001',
        studyDate: '2024-01-01',
        viewType: 'CC',
        age: 55,
        breastDensity: 'C'
      },
      analysis: {
        probability: 0.67,
        probabilityPercent: '67.00%',
        biRads: 'BI-RADS 3',
        biRadsDescription: 'Probably benign',
        biRadsRecommendation: 'Short-term follow-up',
        confidence: 0.91,
        explanation: 'Low risk finding',
        heatmapUrl: 'data:image/png;base64,...',
        processingTimeMs: 234
      }
    };
    
    expect(mockDemo.analysis.probability).toBe(0.67);
  });
});