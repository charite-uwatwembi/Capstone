import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';

interface DataTableProps {
  isDarkMode: boolean;
  data: Array<{
    id: number;
    date: string;
    cropType: string;
    fertilizer: string;
    rate: number;
    confidence: number;
    phosphorus: number;
    potassium: number;
    nitrogen: number;
  }>;
}

const DataTable: React.FC<DataTableProps> = ({ isDarkMode, data }) => {
  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <FileSpreadsheet className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Analysis Summary</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Batch processing results and data history
            </p>
          </div>
        </div>
        <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Date
                </th>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Crop
                </th>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Fertilizer
                </th>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Rate (kg/ha)
                </th>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confidence
                </th>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  P (ppm)
                </th>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  K (ppm)
                </th>
                <th className={`text-left py-3 px-4 font-medium text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  N (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr 
                  key={row.id}
                  className={`border-b transition-colors hover:bg-opacity-50 ${
                    isDarkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4 text-sm">{row.date}</td>
                  <td className="py-3 px-4 text-sm capitalize">{row.cropType}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                      {row.fertilizer}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{row.rate}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        row.confidence >= 90 ? 'bg-green-500' :
                        row.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span>{row.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{row.phosphorus}</td>
                  <td className="py-3 px-4 text-sm">{row.potassium}</td>
                  <td className="py-3 px-4 text-sm">{row.nitrogen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <FileSpreadsheet className={`h-12 w-12 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No analysis data available yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;