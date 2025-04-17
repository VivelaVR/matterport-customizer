import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface AnalyticsDashboardProps {
  className?: string;
  timeRange?: '7d' | '30d' | '90d';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  className = '', 
  timeRange = '7d'
}) => {
  // Données simulées pour le tableau de bord
  const [dashboardData, setDashboardData] = useState({
    totalVisits: 0,
    averageDuration: 0,
    popularAreas: [] as { name: string; visits: number }[],
    popularTags: [] as { name: string; clicks: number }[],
    deviceBreakdown: [] as { device: string; percentage: number }[],
    dailyVisits: [] as { date: string; visits: number }[]
  });
  
  // Charger les données du tableau de bord en fonction de la plage de temps
  useEffect(() => {
    // Simuler le chargement des données
    const loadData = () => {
      // Dans une application réelle, ces données proviendraient d'une API
      const data = {
        totalVisits: Math.floor(Math.random() * 1000) + 500,
        averageDuration: Math.floor(Math.random() * 300) + 120,
        popularAreas: [
          { name: 'Entrée', visits: Math.floor(Math.random() * 300) + 200 },
          { name: 'Salon', visits: Math.floor(Math.random() * 300) + 150 },
          { name: 'Cuisine', visits: Math.floor(Math.random() * 300) + 100 },
          { name: 'Chambre principale', visits: Math.floor(Math.random() * 300) + 50 }
        ],
        popularTags: [
          { name: 'Info produit', clicks: Math.floor(Math.random() * 200) + 100 },
          { name: 'Prix', clicks: Math.floor(Math.random() * 200) + 80 },
          { name: 'Dimensions', clicks: Math.floor(Math.random() * 200) + 60 },
          { name: 'Matériaux', clicks: Math.floor(Math.random() * 200) + 40 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', percentage: Math.floor(Math.random() * 40) + 30 },
          { device: 'Mobile', percentage: Math.floor(Math.random() * 30) + 20 },
          { device: 'Tablet', percentage: Math.floor(Math.random() * 20) + 10 },
          { device: 'VR', percentage: Math.floor(Math.random() * 10) + 5 }
        ],
        dailyVisits: [] as { date: string; visits: number }[]
      };
      
      // Générer des données de visites quotidiennes
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const today = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.dailyVisits.push({
          date: date.toISOString().split('T')[0],
          visits: Math.floor(Math.random() * 100) + 10
        });
      }
      
      setDashboardData(data);
    };
    
    loadData();
  }, [timeRange]);
  
  return (
    <div className={`analytics-dashboard ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Visites totales</div>
          <div className="text-2xl font-bold mt-1">{dashboardData.totalVisits}</div>
          <div className="text-xs text-green-500 mt-1">+12% par rapport à la période précédente</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Durée moyenne de visite</div>
          <div className="text-2xl font-bold mt-1">{Math.floor(dashboardData.averageDuration / 60)}m {dashboardData.averageDuration % 60}s</div>
          <div className="text-xs text-red-500 mt-1">-3% par rapport à la période précédente</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium mb-3">Zones les plus visitées</h3>
          <div className="space-y-2">
            {dashboardData.popularAreas.map((area, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="text-sm">{area.name}</div>
                <div className="flex items-center">
                  <div className="text-sm font-medium mr-2">{area.visits}</div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(area.visits / dashboardData.popularAreas[0].visits) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium mb-3">Tags les plus cliqués</h3>
          <div className="space-y-2">
            {dashboardData.popularTags.map((tag, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="text-sm">{tag.name}</div>
                <div className="flex items-center">
                  <div className="text-sm font-medium mr-2">{tag.clicks}</div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(tag.clicks / dashboardData.popularTags[0].clicks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-md font-medium mb-3">Visites quotidiennes</h3>
        <div className="h-60">
          <div className="flex h-full items-end">
            {dashboardData.dailyVisits.map((day, index) => {
              const maxVisits = Math.max(...dashboardData.dailyVisits.map(d => d.visits));
              const height = (day.visits / maxVisits) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-1 transform -rotate-45 origin-top-left">
                    {day.date.split('-').slice(1).join('/')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-medium mb-3">Répartition par appareil</h3>
        <div className="flex justify-center">
          <div className="w-48 h-48 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm font-medium">Appareils</div>
            </div>
            {dashboardData.deviceBreakdown.map((device, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
              const startAngle = dashboardData.deviceBreakdown
                .slice(0, index)
                .reduce((sum, d) => sum + d.percentage, 0) / 100 * 360;
              const endAngle = startAngle + (device.percentage / 100 * 360);
              
              return (
                <div 
                  key={index}
                  className={`absolute inset-0 ${colors[index % colors.length]}`}
                  style={{
                    clipPath: `path('M 24 24 L 24 0 A 24 24 0 ${endAngle - startAngle > 180 ? '1' : '0'} 1 ${
                      24 + 24 * Math.sin((endAngle * Math.PI) / 180)
                    } ${24 - 24 * Math.cos((endAngle * Math.PI) / 180)} L 24 24 Z')`,
                    transform: `rotate(${startAngle}deg)`
                  }}
                ></div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          {dashboardData.deviceBreakdown.map((device, index) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
            return (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-1`}></div>
                <div className="text-xs">{device.device} ({device.percentage}%)</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
