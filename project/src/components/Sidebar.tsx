import React from 'react';
import { 
  Home, 
  BarChart3, 
  FileText, 
  Settings, 
  User, 
  Sprout,
  Database,
  TrendingUp,
  Bell,
  HelpCircle
} from 'lucide-react';
import type { AuthUser } from '../services/authService';

interface SidebarProps {
  isCollapsed: boolean;
  isDarkMode: boolean;
  user: AuthUser | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isDarkMode, user }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Sprout, label: 'Crops' },
    { icon: Database, label: 'Soil Data' },
    { icon: TrendingUp, label: 'Reports' },
    { icon: FileText, label: 'History' },
    { icon: Bell, label: 'Alerts' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
      
      {/* Logo Section */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-green-600">SoilSync</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Smart Agriculture
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium">
                {user ? user.fullName || user.email.split('@')[0] : 'Guest User'}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user ? user.planType.charAt(0).toUpperCase() + user.planType.slice(1) + ' Plan' : 'Demo Mode'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                item.active 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
              }`}>
                <item.icon className={`h-5 w-5 ${item.active ? 'text-green-600 dark:text-green-400' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">System Status</span>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              All sensors online
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;