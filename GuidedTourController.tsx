import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface GuidedTourControllerProps {
  className?: string;
}

export const GuidedTourController: React.FC<GuidedTourControllerProps> = ({ 
  className = ''
}) => {
  const { guidedTour, actions } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  
  // Référence à la visite active
  const activeTour = guidedTour.activeTourId 
    ? guidedTour.tours.find(tour => tour.id === guidedTour.activeTourId)
    : null;
  
  // Référence au point d'intérêt actuel
  const currentWaypoint = activeTour && activeTour.waypoints.length > 0
    ? activeTour.waypoints[currentWaypointIndex]
    : null;
  
  // Démarrer la visite
  const startTour = () => {
    setIsPlaying(true);
    setCurrentWaypointIndex(0);
    setProgress(0);
    
    // Dans une application réelle, cela utiliserait le SDK Matterport pour naviguer vers le premier point
    console.log('Démarrage de la visite guidée:', activeTour?.name);
    console.log('Navigation vers le premier point:', currentWaypoint?.name);
    
    // Initialiser le temps restant
    if (currentWaypoint) {
      setRemainingTime(currentWaypoint.duration);
    }
  };
  
  // Mettre en pause la visite
  const pauseTour = () => {
    setIsPlaying(false);
  };
  
  // Reprendre la visite
  const resumeTour = () => {
    setIsPlaying(true);
  };
  
  // Arrêter la visite
  const stopTour = () => {
    setIsPlaying(false);
    setCurrentWaypointIndex(0);
    setProgress(0);
    setRemainingTime(0);
    
    // Dans une application réelle, cela utiliserait le SDK Matterport pour revenir à la vue initiale
    console.log('Arrêt de la visite guidée');
  };
  
  // Passer au point suivant
  const nextWaypoint = () => {
    if (!activeTour) return;
    
    const nextIndex = currentWaypointIndex + 1;
    
    if (nextIndex < activeTour.waypoints.length) {
      setCurrentWaypointIndex(nextIndex);
      setProgress((nextIndex / activeTour.waypoints.length) * 100);
      
      // Dans une application réelle, cela utiliserait le SDK Matterport pour naviguer vers le point suivant
      console.log('Navigation vers le point suivant:', activeTour.waypoints[nextIndex].name);
      
      // Réinitialiser le temps restant
      setRemainingTime(activeTour.waypoints[nextIndex].duration);
    } else {
      // Fin de la visite
      if (guidedTour.settings.loopTours) {
        // Recommencer la visite
        setCurrentWaypointIndex(0);
        setProgress(0);
        
        // Dans une application réelle, cela utiliserait le SDK Matterport pour naviguer vers le premier point
        console.log('Redémarrage de la visite guidée');
        
        // Réinitialiser le temps restant
        if (activeTour.waypoints.length > 0) {
          setRemainingTime(activeTour.waypoints[0].duration);
        }
      } else {
        // Arrêter la visite
        stopTour();
      }
    }
  };
  
  // Revenir au point précédent
  const prevWaypoint = () => {
    if (!activeTour) return;
    
    const prevIndex = currentWaypointIndex - 1;
    
    if (prevIndex >= 0) {
      setCurrentWaypointIndex(prevIndex);
      setProgress((prevIndex / activeTour.waypoints.length) * 100);
      
      // Dans une application réelle, cela utiliserait le SDK Matterport pour naviguer vers le point précédent
      console.log('Navigation vers le point précédent:', activeTour.waypoints[prevIndex].name);
      
      // Réinitialiser le temps restant
      setRemainingTime(activeTour.waypoints[prevIndex].duration);
    }
  };
  
  // Effet pour gérer le décompte du temps et la progression automatique
  useEffect(() => {
    if (!isPlaying || !activeTour || !currentWaypoint) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          // Passer au point suivant
          clearInterval(timer);
          nextWaypoint();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, currentWaypoint, currentWaypointIndex, activeTour]);
  
  // Si aucune visite n'est active, afficher un message
  if (!activeTour) {
    return (
      <div className={`guided-tour-controller ${className} p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}>
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Aucune visite guidée active. Veuillez sélectionner une visite pour commencer.
          </p>
          
          <button
            onClick={() => {
              useAppStore.setState(state => {
                state.ui.guidedTourTab = 'tours';
              });
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Voir les visites disponibles
          </button>
        </div>
      </div>
    );
  }
  
  // Formater le temps restant
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`guided-tour-controller ${className} p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}>
      <div className="mb-4">
        <h2 className="text-lg font-medium">{activeTour.name}</h2>
        
        {guidedTour.settings.showProgressBar && (
          <div className="mt-2 relative">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <div>Point {currentWaypointIndex + 1}/{activeTour.waypoints.length}</div>
              <div>{formatTime(remainingTime)}</div>
            </div>
          </div>
        )}
      </div>
      
      {currentWaypoint && guidedTour.settings.showInfoPanel && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="font-medium text-sm">{currentWaypoint.name}</h3>
          
          {currentWaypoint.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentWaypoint.description}
            </p>
          )}
        </div>
      )}
      
      <div className="flex justify-center space-x-4">
        {guidedTour.settings.allowSkip && (
          <button
            onClick={prevWaypoint}
            disabled={currentWaypointIndex === 0}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {guidedTour.settings.allowPause && (
          isPlaying ? (
            <button
              onClick={pauseTour}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={resumeTour}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )
        )}
        
        <button
          onClick={stopTour}
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
        
        {guidedTour.settings.allowSkip && (
          <button
            onClick={nextWaypoint}
            disabled={currentWaypointIndex === activeTour.waypoints.length - 1 && !guidedTour.settings.loopTours}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      
      {!isPlaying && (
        <div className="mt-4 text-center">
          <button
            onClick={startTour}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Démarrer la visite
          </button>
        </div>
      )}
    </div>
  );
};

export default GuidedTourController;
