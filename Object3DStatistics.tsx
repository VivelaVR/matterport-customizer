import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import Object3DPositioner from '@/components/matterport/Object3DPositioner';

interface Object3DStatisticsProps {
  className?: string;
}

export const Object3DStatistics: React.FC<Object3DStatisticsProps> = ({ className = '' }) => {
  const { objects3D } = useAppStore();
  const [stats, setStats] = useState({
    total: 0,
    visible: 0,
    hidden: 0,
    byModel: {} as Record<string, number>,
    averageScale: { x: 0, y: 0, z: 0 },
  });
  
  // Calculer les statistiques lorsque les objets changent
  useEffect(() => {
    const byModel: Record<string, number> = {};
    let visible = 0;
    let hidden = 0;
    let totalScaleX = 0;
    let totalScaleY = 0;
    let totalScaleZ = 0;
    
    objects3D.items.forEach(obj => {
      // Compter par modèle
      const modelName = obj.modelUrl.split('/').pop() || obj.modelUrl;
      byModel[modelName] = (byModel[modelName] || 0) + 1;
      
      // Compter les objets visibles/cachés
      if (obj.visible) {
        visible++;
      } else {
        hidden++;
      }
      
      // Calculer les échelles moyennes
      totalScaleX += obj.scale.x;
      totalScaleY += obj.scale.y;
      totalScaleZ += obj.scale.z;
    });
    
    const total = objects3D.items.length;
    
    setStats({
      total,
      visible,
      hidden,
      byModel,
      averageScale: {
        x: total > 0 ? totalScaleX / total : 0,
        y: total > 0 ? totalScaleY / total : 0,
        z: total > 0 ? totalScaleZ / total : 0,
      },
    });
  }, [objects3D.items]);
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Statistiques des objets 3D</h2>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Objets au total</div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.visible}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Objets visibles</div>
          </div>
        </div>
        
        {stats.total > 0 && (
          <>
            <h3 className="text-md font-medium mt-4 mb-2">Échelle moyenne</h3>
            <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div>
                <div className="text-lg font-bold">{stats.averageScale.x.toFixed(2)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">X</div>
              </div>
              <div>
                <div className="text-lg font-bold">{stats.averageScale.y.toFixed(2)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Y</div>
              </div>
              <div>
                <div className="text-lg font-bold">{stats.averageScale.z.toFixed(2)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Z</div>
              </div>
            </div>
            
            <h3 className="text-md font-medium mt-4 mb-2">Répartition par modèle</h3>
            <div className="space-y-2">
              {Object.entries(stats.byModel).map(([model, count]) => (
                <div 
                  key={model} 
                  className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  <div className="text-sm truncate max-w-[70%]" title={model}>
                    {model}
                  </div>
                  <div className="text-sm font-medium">
                    {count} ({Math.round(count / stats.total * 100)}%)
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {Object.entries(stats.byModel).map(([model, count], index, array) => {
                  // Calculer la position de début pour ce segment
                  const previousWidth = array
                    .slice(0, index)
                    .reduce((sum, [_, c]) => sum + (c / stats.total * 100), 0);
                  
                  // Générer une couleur basée sur l'index
                  const hue = (index * 137.5) % 360;
                  const color = `hsl(${hue}, 70%, 60%)`;
                  
                  return (
                    <div
                      key={model}
                      className="h-full float-left"
                      style={{
                        width: `${count / stats.total * 100}%`,
                        backgroundColor: color,
                        marginLeft: index === 0 ? '0' : undefined,
                      }}
                      title={`${model}: ${count} objets (${Math.round(count / stats.total * 100)}%)`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        
        {stats.total === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Aucun objet 3D n'a encore été ajouté.
          </div>
        )}
      </div>
    </div>
  );
};

export default Object3DStatistics;
