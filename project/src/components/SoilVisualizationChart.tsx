import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { BarChart3, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface SoilVisualizationChartProps {
  isDarkMode: boolean;
  soilData: {
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
  } | null;
  recommendation: {
    fertilizer: string;
    rate: number;
    confidence: number;
    expectedYield: number;
  } | null;
}

const SoilVisualizationChart: React.FC<SoilVisualizationChartProps> = ({ 
  isDarkMode, 
  soilData,
  recommendation 
}) => {
  if (!soilData || !recommendation) {
    return (
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="text-center py-8">
          <BarChart3 className={`h-12 w-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Submit soil data to see visualization
          </p>
        </div>
      </div>
    );
  }

  // Soil Chemistry Bar Chart Data
  const chemistryData = {
    labels: ['Phosphorus (ppm)', 'Potassium (ppm)', 'Nitrogen (%)', 'Organic Carbon (%)', 'CEC (cmol/kg)'],
    datasets: [
      {
        label: 'Current Levels',
        data: [
          soilData.phosphorus,
          soilData.potassium,
          soilData.nitrogen * 100, // Convert to percentage for better visualization
          soilData.organicCarbon,
          soilData.cationExchange
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Soil Texture Radar Chart Data
  const textureData = {
    labels: ['Sand %', 'Clay %', 'Silt %'],
    datasets: [
      {
        label: 'Soil Texture Composition',
        data: [soilData.sandPercent, soilData.clayPercent, soilData.siltPercent],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#374151',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? '#374151' : '#f3f4f6',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          maxRotation: 45,
        }
      },
      y: {
        grid: {
          color: isDarkMode ? '#374151' : '#f3f4f6',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        }
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#374151',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      r: {
        angleLines: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        pointLabels: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          backdropColor: 'transparent',
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
          <Target className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Soil Analysis Visualization</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Visual breakdown of your soil composition and fertilizer match
          </p>
        </div>
      </div>

      {/* Recommendation Summary */}
      <div className={`mb-6 p-4 rounded-lg border-2 border-dashed ${
        isDarkMode ? 'border-indigo-600 bg-indigo-900/10' : 'border-indigo-200 bg-indigo-50/50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Recommended for {soilData.cropType}
            </p>
            <p className="text-lg font-bold text-indigo-600">
              {recommendation.fertilizer} at {recommendation.rate} kg/ha
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Confidence
            </p>
            <p className="text-lg font-bold text-green-600">
              {recommendation.confidence}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Chemistry Bar Chart */}
        <div>
          <h4 className="font-medium mb-4 flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            <span>Soil Chemistry Levels</span>
          </h4>
          <div className="h-64">
            <Bar data={chemistryData} options={chartOptions} />
          </div>
        </div>

        {/* Soil Texture Radar Chart */}
        <div>
          <h4 className="font-medium mb-4 flex items-center space-x-2">
            <Target className="h-4 w-4 text-green-600" />
            <span>Soil Texture Composition</span>
          </h4>
          <div className="h-64">
            <Radar data={textureData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* Environmental Factors */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Rainfall
          </p>
          <p className="text-lg font-bold">{soilData.rainfall} mm</p>
        </div>
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Elevation
          </p>
          <p className="text-lg font-bold">{soilData.elevation} m</p>
        </div>
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Expected Yield
          </p>
          <p className="text-lg font-bold text-green-600">+{recommendation.expectedYield}%</p>
        </div>
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Crop Type
          </p>
          <p className="text-lg font-bold capitalize">{soilData.cropType}</p>
        </div>
      </div>
    </div>
  );
};

export default SoilVisualizationChart;