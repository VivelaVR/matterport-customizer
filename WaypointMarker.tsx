import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface WaypointMarkerProps {
  waypoint: {
    id: string;
    name: string;
    description: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    duration: number;
  };
  isActive?: boolean;
  index: number;
  onClick?: () => void;
}

export const WaypointMarker: React.FC<WaypointMarkerProps> = ({ 
  waypoint,
  isActive = false,
  index,
  onClick
}) => {
  const { guidedTour } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);
  
  // Déterminer si les points doivent être mis en évidence
  const shouldHighlight = guidedTour.settings.highlightPoints;
  
  return (
    <div 
      className={`waypoint-marker absolute cursor-pointer transition-transform ${
        isHovered ? 'scale-110' : 'scale-100'
      }`}
      style={{
        left: `${waypoint.position.x}px`,
        top: `${waypoint.position.y}px`,
        zIndex: Math.floor(waypoint.position.z)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${isActive 
          ? 'bg-green-500 text-white' 
          : shouldHighlight 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }
        ${isHovered ? 'ring-2 ring-offset-2 ring-blue-300 dark:ring-blue-700' : ''}
      `}>
        {index + 1}
      </div>
      
      {(isHovered || isActive) && (
        <div className="absolute left-full ml-2 top-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
          <div className="p-2">
            <h3 className="font-medium text-sm">{waypoint.name}</h3>
            
            {waypoint.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {waypoint.description}
              </p>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              Durée: {waypoint.duration} sec
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaypointMarker;
