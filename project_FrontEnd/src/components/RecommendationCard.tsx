import React from 'react';
import { Zap, Target, TrendingUp } from 'lucide-react';

interface RecommendationCardProps {
  isDarkMode: boolean;
  recommendation: {
    fertilizer: string;
    rate: number;
    confidence: number;
    expectedYield: number;
  } | null;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  isDarkMode, 
  recommendation 
}) => {
  if (!recommendation) {
    return (
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="text-center py-8">
          <Zap className={`h-12 w-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Submit soil data to get fertilizer recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <Zap className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Latest Recommendation</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI-powered fertilizer analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fertilizer Type */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-green-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Fertilizer</span>
          </div>
          <p className="text-lg font-bold">{recommendation.fertilizer}</p>
        </div>

        {/* Application Rate */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Rate</span>
          </div>
          <p className="text-lg font-bold">{recommendation.rate} kg/ha</p>
        </div>

        {/* Confidence */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Confidence</span>
          </div>
          <p className="text-lg font-bold">{recommendation.confidence}%</p>
        </div>
      </div>

      {/* Expected Yield */}
      <div className={`mt-4 p-4 rounded-lg border-2 border-dashed ${
        isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-green-200 bg-green-50/50'
      }`}>
        <div className="text-center">
          <p className={`text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Expected Yield Increase
          </p>
          <p className="text-2xl font-bold text-green-600">
            +{recommendation.expectedYield}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;