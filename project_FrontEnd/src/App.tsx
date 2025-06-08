import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SoilForm from './components/SoilForm';
import RecommendationCard from './components/RecommendationCard';
import RecommendationChart from './components/RecommendationChart';
import SoilVisualizationChart from './components/SoilVisualizationChart';
import AgriNews from './components/AgriNews';
import DataTable from './components/DataTable';

interface SoilData {
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

interface Recommendation {
  fertilizer: string;
  rate: number;
  confidence: number;
  expectedYield: number;
}

interface HistoryData {
  id: number;
  date: string;
  cropType: string;
  fertilizer: string;
  rate: number;
  confidence: number;
  phosphorus: number;
  potassium: number;
  nitrogen: number;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [currentSoilData, setCurrentSoilData] = useState<SoilData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [chartData, setChartData] = useState<Array<{
    date: string;
    fertilizer: string;
    rate: number;
    confidence: number;
  }>>([]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Mock Random Forest prediction function
  const predictFertilizer = (soilData: SoilData): Recommendation => {
    // Simplified mock prediction logic based on soil parameters
    const { phosphorus, potassium, nitrogen, cropType } = soilData;
    
    let fertilizer = "NPK 17-17-17";
    let rate = 150;
    let confidence = 85;
    let expectedYield = 15;

    // Basic decision logic (simplified Random Forest simulation)
    if (nitrogen < 0.2) {
      fertilizer = "Urea";
      rate = 100;
      confidence = 92;
      expectedYield = 20;
    } else if (phosphorus < 15) {
      fertilizer = "DAP";
      rate = 120;
      confidence = 88;
      expectedYield = 18;
    } else if (potassium < 100) {
      fertilizer = "NPK 15-15-15";
      rate = 130;
      confidence = 90;
      expectedYield = 16;
    }

    // Crop-specific adjustments
    if (cropType === 'rice') {
      rate *= 1.2;
      expectedYield += 5;
    } else if (cropType === 'beans') {
      rate *= 0.8;
      fertilizer = "NPK 10-20-10";
    }

    return {
      fertilizer,
      rate: Math.round(rate),
      confidence: Math.min(95, confidence + Math.random() * 10),
      expectedYield: Math.round(expectedYield)
    };
  };

  const handleSoilSubmit = (soilData: SoilData) => {
    const recommendation = predictFertilizer(soilData);
    setCurrentRecommendation(recommendation);
    setCurrentSoilData(soilData);

    // Add to history
    const newHistoryItem: HistoryData = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      cropType: soilData.cropType,
      fertilizer: recommendation.fertilizer,
      rate: recommendation.rate,
      confidence: Math.round(recommendation.confidence),
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      nitrogen: soilData.nitrogen
    };

    setHistoryData(prev => [newHistoryItem, ...prev]);

    // Add to chart data
    const newChartItem = {
      date: new Date().toLocaleDateString(),
      fertilizer: recommendation.fertilizer,
      rate: recommendation.rate,
      confidence: Math.round(recommendation.confidence)
    };

    setChartData(prev => [...prev, newChartItem].slice(-10)); // Keep last 10 entries
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Sidebar isCollapsed={isCollapsed} isDarkMode={isDarkMode} />
      <TopBar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className={`transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      } mt-16 p-6`}>
        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Row - Current Recommendation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecommendationCard 
                isDarkMode={isDarkMode}
                recommendation={currentRecommendation}
              />
            </div>
            <div>
              <SoilForm 
                isDarkMode={isDarkMode}
                onSubmit={handleSoilSubmit}
              />
            </div>
          </div>

          {/* Middle Row - Soil Visualization */}
          <div>
            <SoilVisualizationChart 
              isDarkMode={isDarkMode}
              soilData={currentSoilData}
              recommendation={currentRecommendation}
            />
          </div>

          {/* Third Row - Chart and News */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecommendationChart 
                isDarkMode={isDarkMode}
                data={chartData}
              />
            </div>
            <div>
              <AgriNews isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Bottom Row - Data Table */}
          <div>
            <DataTable 
              isDarkMode={isDarkMode}
              data={historyData}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${
        isCollapsed ? 'ml-16' : 'ml-64'
      } transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2024 SoilSync. Designed and Implemented for Smart Agriculture.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`text-sm hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Privacy Policy
              </button>
              <button className={`text-sm hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Terms of Service
              </button>
              <button className={`text-sm hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;