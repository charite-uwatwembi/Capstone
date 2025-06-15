import React, { useState } from 'react';
import { Beaker, Droplets, Mountain, Wheat, Loader } from 'lucide-react';

interface SoilFormProps {
  isDarkMode: boolean;
  onSubmit: (data: SoilData) => void;
  loading?: boolean;
}

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

const SoilForm: React.FC<SoilFormProps> = ({ isDarkMode, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<SoilData>({
    phosphorus: 0,
    potassium: 0,
    nitrogen: 0,
    organicCarbon: 0,
    cationExchange: 0,
    sandPercent: 0,
    clayPercent: 0,
    siltPercent: 0,
    rainfall: 0,
    elevation: 0,
    cropType: 'maize'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SoilData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  const cropOptions = [
    { value: 'maize', label: 'Maize' },
    { value: 'rice', label: 'Rice' },
    { value: 'beans', label: 'Beans' },
    { value: 'potato', label: 'Potato' },
    { value: 'cassava', label: 'Cassava' },
    { value: 'banana', label: 'Banana' }
  ];

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <Beaker className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">New Soil Analysis</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter soil parameters for fertilizer recommendation
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Soil Chemistry */}
        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <Beaker className="h-4 w-4 text-green-600" />
            <span>Soil Chemistry</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Phosphorus (ppm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.phosphorus}
                onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Potassium (ppm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.potassium}
                onChange={(e) => handleInputChange('potassium', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Total Nitrogen (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.nitrogen}
                onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Organic Carbon (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.organicCarbon}
                onChange={(e) => handleInputChange('organicCarbon', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cation Exchange Capacity (cmol/kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.cationExchange}
                onChange={(e) => handleInputChange('cationExchange', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
          </div>
        </div>

        {/* Soil Texture */}
        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <Mountain className="h-4 w-4 text-green-600" />
            <span>Soil Texture</span>
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Sand (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.sandPercent}
                onChange={(e) => handleInputChange('sandPercent', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Clay (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.clayPercent}
                onChange={(e) => handleInputChange('clayPercent', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Silt (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.siltPercent}
                onChange={(e) => handleInputChange('siltPercent', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
          </div>
        </div>

        {/* Environmental Factors */}
        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-green-600" />
            <span>Environmental Factors</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Annual Rainfall (mm)
              </label>
              <input
                type="number"
                value={formData.rainfall}
                onChange={(e) => handleInputChange('rainfall', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Elevation (m)
              </label>
              <input
                type="number"
                value={formData.elevation}
                onChange={(e) => handleInputChange('elevation', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              />
            </div>
          </div>
        </div>

        {/* Crop Selection */}
        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <Wheat className="h-4 w-4 text-green-600" />
            <span>Crop Type</span>
          </h4>
          <select
            value={formData.cropType}
            onChange={(e) => handleInputChange('cropType', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
            } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
          >
            {cropOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Analyzing Soil...</span>
            </>
          ) : (
            <span>Get Fertilizer Recommendation</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default SoilForm;