import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';

interface AgriNewsProps {
  isDarkMode: boolean;
}

const AgriNews: React.FC<AgriNewsProps> = ({ isDarkMode }) => {
  const newsArticles = [
    {
      id: 1,
      title: "Rwanda's Smart Agriculture Initiative Shows Promising Results",
      excerpt: "New data reveals significant yield improvements across participating farms using precision agriculture techniques.",
      author: "Ministry of Agriculture",
      date: "2024-01-15",
      image: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400",
      url: "#"
    },
    {
      id: 2,
      title: "Soil Health Monitoring: Best Practices for Rwandan Farmers",
      excerpt: "Expert recommendations on maintaining optimal soil conditions for sustainable crop production.",
      author: "Rwanda Agriculture Board",
      date: "2024-01-12",
      image: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400",
      url: "#"
    },
    {
      id: 3,
      title: "Climate-Smart Fertilizer Application Techniques",
      excerpt: "How precision fertilizer application is helping farmers adapt to changing weather patterns.",
      author: "CGIAR Research",
      date: "2024-01-10",
      image: "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400",
      url: "#"
    },
    {
      id: 4,
      title: "Digital Agriculture Tools Transform Rural Communities",
      excerpt: "Mobile technology and AI-powered recommendations are revolutionizing farming practices.",
      author: "Tech4Agriculture",
      date: "2024-01-08",
      image: "https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400",
      url: "#"
    }
  ];

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Agri-News</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Latest agricultural insights from Rwanda
          </p>
        </div>
        <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1">
          <span>View All</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {newsArticles.map((article) => (
          <div 
            key={article.id}
            className={`group cursor-pointer transition-all duration-200 hover:scale-105 ${
              isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
            } p-4 rounded-lg`}
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                  {article.title}
                </h4>
                <p className={`text-xs mt-1 line-clamp-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {article.excerpt}
                </p>
                <div className={`flex items-center space-x-4 mt-2 text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgriNews;