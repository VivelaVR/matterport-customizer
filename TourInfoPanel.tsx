import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface TourInfoPanelProps {
  className?: string;
}

export const TourInfoPanel: React.FC<TourInfoPanelProps> = ({ 
  className = ''
}) => {
  const { guidedTour } = useAppStore();
  
  // Référence à la visite active
  const activeTour = guidedTour.activeTourId 
    ? guidedTour.tours.find(tour => tour.id === guidedTour.activeTourId)
    : null;
  
  // Référence au point d'intérêt actuel
  const currentWaypoint = activeTour && activeTour.waypoints.length > 0 && guidedTour.currentWaypointIndex >= 0
    ? activeTour.waypoints[guidedTour.currentWaypointIndex]
    : null;
  
  // Si aucune visite n'est active, afficher un message
  if (!activeTour) {
    return (
      <div className={`tour-info-panel ${className} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4`}>
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">
            Aucune visite guidée active.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`tour-info-panel ${className} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4`}>
      <h2 className="text-lg font-medium mb-2">{activeTour.name}</h2>
      
      {activeTour.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {activeTour.description}
        </p>
      )}
      
      <div className="mb-4">
        <div className="text-sm font-medium mb-1">Progression</div>
        <div className="flex items-center">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${((guidedTour.currentWaypointIndex + 1) / activeTour.waypoints.length) * 100}%` }}
            ></div>
          </div>
          <div className="ml-2 text-xs text-gray-500">
            {guidedTour.currentWaypointIndex + 1}/{activeTour.waypoints.length}
          </div>
        </div>
      </div>
      
      {currentWaypoint && (
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded mb-4">
          <h3 className="font-medium text-sm mb-1">Point actuel: {currentWaypoint.name}</h3>
          
          {currentWaypoint.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentWaypoint.description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="text-sm font-medium mb-1">Points d'intérêt</div>
        
        <div className="max-h-40 overflow-y-auto pr-2">
          {activeTour.waypoints.map((waypoint, index) => (
            <div 
              key={waypoint.id}
              className={`flex items-center p-2 rounded ${
                index === guidedTour.currentWaypointIndex 
                  ? 'bg-blue-100 dark:bg-blue-900' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2
                ${index === guidedTour.currentWaypointIndex 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
              `}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-medium">{waypoint.name}</div>
                {waypoint.description && (
                  <div className="text-xs text-gray-500 truncate">
                    {waypoint.description}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                {waypoint.duration}s
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Durée totale: {activeTour.duration} min
      </div>
    </div>
  );
};

export default TourInfoPanel;
