import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface TourMapProps {
  className?: string;
  onWaypointClick?: (waypointId: string, index: number) => void;
}

export const TourMap: React.FC<TourMapProps> = ({ 
  className = '',
  onWaypointClick
}) => {
  const { guidedTour } = useAppStore();
  const [mapImage, setMapImage] = useState('/placeholder-map.jpg');
  const [mapDimensions, setMapDimensions] = useState({ width: 600, height: 400 });
  
  // Référence à la visite active
  const activeTour = guidedTour.activeTourId 
    ? guidedTour.tours.find(tour => tour.id === guidedTour.activeTourId)
    : null;
  
  // Charger l'image de la carte
  useEffect(() => {
    // Dans une application réelle, cela utiliserait le SDK Matterport pour obtenir une vue de dessus
    // Pour l'instant, nous utilisons une image statique
    if (activeTour) {
      // Simuler le chargement d'une carte spécifique à la visite
      console.log('Chargement de la carte pour la visite:', activeTour.name);
    }
  }, [activeTour]);
  
  // Si aucune visite n'est active, afficher un message
  if (!activeTour) {
    return (
      <div className={`tour-map ${className} bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center`}>
        <div className="text-center p-4">
          <p className="text-gray-500 dark:text-gray-400">
            Aucune visite guidée active.
          </p>
        </div>
      </div>
    );
  }
  
  // Calculer la position des points sur la carte
  const calculateMapPosition = (position: { x: number; y: number; z: number }) => {
    // Dans une application réelle, cela convertirait les coordonnées 3D en coordonnées 2D pour la carte
    // Pour l'instant, nous utilisons des positions aléatoires
    return {
      x: Math.floor(Math.random() * (mapDimensions.width - 40)) + 20,
      y: Math.floor(Math.random() * (mapDimensions.height - 40)) + 20
    };
  };
  
  return (
    <div className={`tour-map ${className} bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative`}>
      {/* Image de la carte */}
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${mapImage})`,
          width: mapDimensions.width,
          height: mapDimensions.height
        }}
      >
        {/* Points d'intérêt */}
        {activeTour.waypoints.map((waypoint, index) => {
          const mapPos = calculateMapPosition(waypoint.position);
          
          return (
            <div 
              key={waypoint.id}
              className="absolute cursor-pointer transition-transform hover:scale-110"
              style={{
                left: `${mapPos.x}px`,
                top: `${mapPos.y}px`
              }}
              onClick={() => onWaypointClick && onWaypointClick(waypoint.id, index)}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${guidedTour.currentWaypointIndex === index 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white'}
              `}>
                {index + 1}
              </div>
              
              {index < activeTour.waypoints.length - 1 && (
                <div className="absolute top-3 left-3 w-10 h-0.5 bg-blue-300 origin-left"
                  style={{
                    transform: 'rotate(45deg)',
                    width: '50px'
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Légende */}
      <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 rounded p-2 text-xs shadow-md">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>Point d'intérêt</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Position actuelle</span>
        </div>
      </div>
    </div>
  );
};

export default TourMap;
