import React from 'react';
import { Menu, Sun, Moon, Bell, Search, LogIn, LogOut } from 'lucide-react';
import type { AuthUser } from '../services/authService';

interface TopBarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: AuthUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isDarkMode, 
  toggleDarkMode,
  user,
  onSignIn,
  onSignOut
}) => {
  return (
    <header className={`fixed top-0 right-0 h-16 transition-all duration-300 z-30 ${
      isCollapsed ? 'left-16' : 'left-64'
    } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="flex items-center justify-between h-full px-6">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div>
            <h2 className="text-lg font-semibold">Soil Analysis Dashboard</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Real-time fertilizer recommendations
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
          </div>

          {/* Notifications */}
          <button className={`p-2 rounded-lg transition-colors duration-200 relative ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}>
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={onSignOut}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;