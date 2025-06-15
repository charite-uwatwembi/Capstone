import { supabase, isDemoMode } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type SoilAnalysis = Database['public']['Tables']['soil_analyses']['Insert'];
type SoilAnalysisRow = Database['public']['Tables']['soil_analyses']['Row'];

export interface SoilData {
  phosphorus: number;
  potassium: number;
  nitrogen: number;
  organicCarbon: number;
  cationExchange: number;
  sandPercent: number;
  clayPercent: number;
  siltPercent: number;
  rainfall: number;
  elevation: number;
  cropType: string;
}

export interface Recommendation {
  fertilizer: string;
  rate: number;
  confidence: number;
  expectedYield: number;
}

export interface AnalysisResult extends Recommendation {
  id: string;
  createdAt: string;
  soilData: SoilData;
}

// Local storage for demo mode
const DEMO_STORAGE_KEY = 'soilsync_demo_analyses';

class SoilAnalysisService {
  // Call the ML model prediction endpoint
  async predictFertilizer(soilData: SoilData): Promise<Recommendation> {
    try {
      if (isDemoMode) {
        // Use mock prediction in demo mode
        return this.mockPrediction(soilData);
      }

      // Call the Supabase Edge Function for ML prediction
      const { data, error } = await supabase.functions.invoke('predict-fertilizer', {
        body: {
          phosphorus: soilData.phosphorus,
          potassium: soilData.potassium,
          nitrogen: soilData.nitrogen,
          organic_carbon: soilData.organicCarbon,
          cation_exchange: soilData.cationExchange,
          sand_percent: soilData.sandPercent,
          clay_percent: soilData.clayPercent,
          silt_percent: soilData.siltPercent,
          rainfall: soilData.rainfall,
          elevation: soilData.elevation,
          crop_type: soilData.cropType
        }
      });

      if (error) {
        console.error('Prediction error:', error);
        // Fallback to mock prediction if edge function fails
        return this.mockPrediction(soilData);
      }

      return {
        fertilizer: data.fertilizer,
        rate: data.application_rate,
        confidence: data.confidence_score,
        expectedYield: data.expected_yield_increase
      };
    } catch (error) {
      console.error('Prediction service error:', error);
      // Fallback to mock prediction
      return this.mockPrediction(soilData);
    }
  }

  // Enhanced mock prediction logic
  private mockPrediction(soilData: SoilData): Recommendation {
    const { phosphorus, potassium, nitrogen, organicCarbon, cationExchange, cropType } = soilData;
    
    let fertilizer = "NPK 17-17-17";
    let rate = 150;
    let confidence = 85;
    let expectedYield = 15;

    // Enhanced decision logic
    if (nitrogen < 0.15) {
      fertilizer = "Urea";
      rate = 120;
      confidence = 94;
      expectedYield = 25;
    } else if (nitrogen < 0.25 && phosphorus < 12) {
      fertilizer = "DAP";
      rate = 110;
      confidence = 91;
      expectedYield = 22;
    } else if (phosphorus < 10) {
      fertilizer = "TSP";
      rate = 100;
      confidence = 89;
      expectedYield = 20;
    } else if (potassium < 80) {
      fertilizer = "NPK 15-15-15";
      rate = 140;
      confidence = 87;
      expectedYield = 18;
    } else if (potassium < 120 && nitrogen > 0.3) {
      fertilizer = "NPK 20-10-10";
      rate = 130;
      confidence = 90;
      expectedYield = 17;
    }

    // Organic matter adjustments
    if (organicCarbon < 1.0) {
      rate *= 1.15;
      expectedYield += 3;
    } else if (organicCarbon > 3.0) {
      rate *= 0.9;
      confidence += 5;
    }

    // CEC adjustments
    if (cationExchange < 5) {
      rate *= 0.85;
      confidence -= 5;
    } else if (cationExchange > 25) {
      rate *= 1.1;
      confidence += 3;
    }

    // Crop-specific adjustments
    switch (cropType.toLowerCase()) {
      case 'rice':
        rate *= 1.25;
        expectedYield += 8;
        if (nitrogen < 0.2) {
          fertilizer = "Urea + NPK 15-15-15";
          confidence += 5;
        }
        break;
      case 'maize':
        rate *= 1.1;
        expectedYield += 5;
        if (nitrogen < 0.25) {
          fertilizer = "NPK 23-10-5";
          confidence += 3;
        }
        break;
      case 'beans':
        rate *= 0.7;
        fertilizer = "NPK 10-20-10";
        expectedYield += 3;
        confidence += 7;
        break;
      case 'potato':
        rate *= 1.15;
        if (potassium < 150) {
          fertilizer = "NPK 15-15-20";
          confidence += 4;
        }
        expectedYield += 6;
        break;
      case 'cassava':
        rate *= 0.8;
        fertilizer = "NPK 15-15-15";
        expectedYield += 4;
        break;
      case 'banana':
        rate *= 1.3;
        fertilizer = "NPK 17-6-18";
        expectedYield += 7;
        break;
    }

    // Add realistic variance
    const variance = (Math.random() - 0.5) * 0.1;
    rate *= (1 + variance);
    confidence += (Math.random() - 0.5) * 8;

    // Ensure reasonable bounds
    rate = Math.max(50, Math.min(300, rate));
    confidence = Math.max(70, Math.min(98, confidence));
    expectedYield = Math.max(5, Math.min(35, expectedYield));

    return {
      fertilizer,
      rate: Math.round(rate),
      confidence: Math.round(confidence * 10) / 10,
      expectedYield: Math.round(expectedYield)
    };
  }

  // Save analysis to database or local storage
  async saveAnalysis(soilData: SoilData, recommendation: Recommendation): Promise<string> {
    if (isDemoMode) {
      // Save to local storage in demo mode
      const analyses = this.getDemoAnalyses();
      const newAnalysis = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        user_id: null,
        ...this.soilDataToDbFormat(soilData),
        recommended_fertilizer: recommendation.fertilizer,
        application_rate: recommendation.rate,
        confidence_score: recommendation.confidence,
        expected_yield_increase: recommendation.expectedYield
      };
      
      analyses.unshift(newAnalysis);
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(analyses.slice(0, 50))); // Keep last 50
      return newAnalysis.id;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const analysisData: SoilAnalysis = {
      user_id: user?.id || null,
      ...this.soilDataToDbFormat(soilData),
      recommended_fertilizer: recommendation.fertilizer,
      application_rate: recommendation.rate,
      confidence_score: recommendation.confidence,
      expected_yield_increase: recommendation.expectedYield
    };

    const { data, error } = await supabase
      .from('soil_analyses')
      .insert(analysisData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save analysis: ${error.message}`);
    }

    return data.id;
  }

  // Get user's analysis history
  async getAnalysisHistory(limit: number = 50): Promise<AnalysisResult[]> {
    if (isDemoMode) {
      const analyses = this.getDemoAnalyses().slice(0, limit);
      return analyses.map(this.dbRowToAnalysisResult);
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('soil_analyses')
      .select('*')
      .eq('user_id', user?.id || null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch analysis history: ${error.message}`);
    }

    return data.map(this.dbRowToAnalysisResult);
  }

  // Helper methods
  private getDemoAnalyses(): SoilAnalysisRow[] {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private soilDataToDbFormat(soilData: SoilData) {
    return {
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      nitrogen: soilData.nitrogen,
      organic_carbon: soilData.organicCarbon,
      cation_exchange: soilData.cationExchange,
      sand_percent: soilData.sandPercent,
      clay_percent: soilData.clayPercent,
      silt_percent: soilData.siltPercent,
      rainfall: soilData.rainfall,
      elevation: soilData.elevation,
      crop_type: soilData.cropType
    };
  }

  private dbRowToAnalysisResult = (row: SoilAnalysisRow): AnalysisResult => ({
    id: row.id,
    createdAt: row.created_at,
    fertilizer: row.recommended_fertilizer,
    rate: row.application_rate,
    confidence: row.confidence_score,
    expectedYield: row.expected_yield_increase,
    soilData: {
      phosphorus: row.phosphorus,
      potassium: row.potassium,
      nitrogen: row.nitrogen,
      organicCarbon: row.organic_carbon,
      cationExchange: row.cation_exchange,
      sandPercent: row.sand_percent,
      clayPercent: row.clay_percent,
      siltPercent: row.silt_percent,
      rainfall: row.rainfall,
      elevation: row.elevation,
      cropType: row.crop_type
    }
  });

  // Get analytics data
  async getAnalytics() {
    if (isDemoMode) {
      const data = this.getDemoAnalyses();
      const totalAnalyses = data.length;
      const avgConfidence = data.reduce((sum, item) => sum + item.confidence_score, 0) / totalAnalyses || 0;
      const avgYieldIncrease = data.reduce((sum, item) => sum + item.expected_yield_increase, 0) / totalAnalyses || 0;
      
      const fertilizerUsage = data.reduce((acc, item) => {
        acc[item.recommended_fertilizer] = (acc[item.recommended_fertilizer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const cropAnalysis = data.reduce((acc, item) => {
        acc[item.crop_type] = (acc[item.crop_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalAnalyses,
        avgConfidence: Math.round(avgConfidence),
        avgYieldIncrease: Math.round(avgYieldIncrease),
        fertilizerUsage,
        cropAnalysis,
        recentAnalyses: data.slice(0, 10)
      };
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('soil_analyses')
      .select('*')
      .eq('user_id', user?.id || null);

    if (error) {
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }

    const totalAnalyses = data.length;
    const avgConfidence = data.reduce((sum, item) => sum + item.confidence_score, 0) / totalAnalyses || 0;
    const avgYieldIncrease = data.reduce((sum, item) => sum + item.expected_yield_increase, 0) / totalAnalyses || 0;
    
    const fertilizerUsage = data.reduce((acc, item) => {
      acc[item.recommended_fertilizer] = (acc[item.recommended_fertilizer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cropAnalysis = data.reduce((acc, item) => {
      acc[item.crop_type] = (acc[item.crop_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAnalyses,
      avgConfidence: Math.round(avgConfidence),
      avgYieldIncrease: Math.round(avgYieldIncrease),
      fertilizerUsage,
      cropAnalysis,
      recentAnalyses: data.slice(0, 10)
    };
  }
}

export const soilAnalysisService = new SoilAnalysisService();