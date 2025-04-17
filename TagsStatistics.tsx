import React, { useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface TagsStatisticsProps {
  className?: string;
}

export const TagsStatistics: React.FC<TagsStatisticsProps> = ({ className = '' }) => {
  const { tags } = useAppStore();
  const [stats, setStats] = React.useState({
    total: 0,
    byColor: {} as Record<string, number>,
    withMedia: 0,
    withLinks: 0,
    withIcons: 0,
  });
  
  // Calculer les statistiques lorsque les tags changent
  useEffect(() => {
    const byColor: Record<string, number> = {};
    let withMedia = 0;
    let withLinks = 0;
    let withIcons = 0;
    
    tags.items.forEach(tag => {
      // Compter par couleur
      byColor[tag.color] = (byColor[tag.color] || 0) + 1;
      
      // Compter les tags avec média
      if (tag.media) {
        withMedia++;
      }
      
      // Compter les tags avec liens
      if (tag.link) {
        withLinks++;
      }
      
      // Compter les tags avec icônes
      if (tag.iconUrl) {
        withIcons++;
      }
    });
    
    setStats({
      total: tags.items.length,
      byColor,
      withMedia,
      withLinks,
      withIcons,
    });
  }, [tags.items]);
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Statistiques des tags</h2>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tags au total</div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.withMedia}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tags avec média</div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.withLinks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tags avec liens</div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.withIcons}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tags avec icônes</div>
          </div>
        </div>
        
        {stats.total > 0 && (
          <>
            <h3 className="text-md font-medium mt-4 mb-2">Répartition par couleur</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byColor).map(([color, count]) => (
                <div 
                  key={color} 
                  className="flex items-center space-x-1 px-2 py-1 rounded"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm">
                    {count} ({Math.round(count / stats.total * 100)}%)
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {Object.entries(stats.byColor).map(([color, count], index, array) => {
                  // Calculer la position de début pour ce segment
                  const previousWidth = array
                    .slice(0, index)
                    .reduce((sum, [_, c]) => sum + (c / stats.total * 100), 0);
                  
                  return (
                    <div
                      key={color}
                      className="h-full float-left"
                      style={{
                        width: `${count / stats.total * 100}%`,
                        backgroundColor: color,
                        marginLeft: index === 0 ? '0' : undefined,
                      }}
                      title={`${color}: ${count} tags (${Math.round(count / stats.total * 100)}%)`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        
        {stats.total === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Aucun tag n'a encore été créé.
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsStatistics;
