import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface NarrationControllerProps {
  className?: string;
}

export const NarrationController: React.FC<NarrationControllerProps> = ({ 
  className = ''
}) => {
  const { guidedTour } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(guidedTour.settings.narrationVolume);
  
  // Référence à la visite active
  const activeTour = guidedTour.activeTourId 
    ? guidedTour.tours.find(tour => tour.id === guidedTour.activeTourId)
    : null;
  
  // Référence au point d'intérêt actuel
  const currentWaypoint = activeTour && activeTour.waypoints.length > 0 && guidedTour.currentWaypointIndex >= 0
    ? activeTour.waypoints[guidedTour.currentWaypointIndex]
    : null;
  
  // Mettre à jour le volume lorsque les paramètres changent
  useEffect(() => {
    setVolume(guidedTour.settings.narrationVolume);
  }, [guidedTour.settings.narrationVolume]);
  
  // Démarrer la narration lorsque le point d'intérêt change
  useEffect(() => {
    if (guidedTour.settings.narrationEnabled && currentWaypoint) {
      // Dans une application réelle, cela démarrerait la lecture d'un fichier audio
      console.log('Démarrage de la narration pour:', currentWaypoint.name);
      setIsPlaying(true);
      
      // Simuler la fin de la narration après la durée du point d'intérêt
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, currentWaypoint.duration * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentWaypoint, guidedTour.settings.narrationEnabled]);
  
  // Si la narration n'est pas activée ou aucune visite n'est active, ne rien afficher
  if (!guidedTour.settings.narrationEnabled || !activeTour) {
    return null;
  }
  
  // Mettre en pause ou reprendre la narration
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // Dans une application réelle, cela mettrait en pause ou reprendrait la lecture audio
    console.log(isPlaying ? 'Pause de la narration' : 'Reprise de la narration');
  };
  
  // Ajuster le volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    // Dans une application réelle, cela ajusterait le volume de l'audio
    console.log('Ajustement du volume à:', newVolume);
  };
  
  return (
    <div className={`narration-controller ${className} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Narration</div>
        
        <button
          onClick={togglePlayPause}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="flex items-center">
        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828m2.828-2.828a9 9 0 010-12.728m0 0l2.828 2.828m-2.828-2.828L5.586 8.464m2.828 2.828l-2.828 2.828" />
        </svg>
        
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        
        <div className="ml-2 text-xs text-gray-500 w-8 text-right">
          {volume}%
        </div>
      </div>
      
      {currentWaypoint && (
        <div className="mt-2 text-xs text-gray-500">
          {isPlaying ? 'En cours:' : 'Prêt:'} {currentWaypoint.name}
        </div>
      )}
    </div>
  );
};

export default NarrationController;
