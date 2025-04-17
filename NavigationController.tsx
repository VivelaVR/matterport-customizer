import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface NavigationControllerProps {
  className?: string;
}

export const NavigationController: React.FC<NavigationControllerProps> = ({ className = '' }) => {
  const { guidedNavigation, actions } = useAppStore();
  
  const handleAddRoute = () => {
    try {
      // Générer un ID unique
      const id = `route-${Date.now()}`;
      
      // Créer une nouvelle route
      const newRoute = {
        id,
        name: 'Nouveau parcours',
        description: 'Description du parcours',
        steps: [],
      };
      
      // Ajouter la route à l'état
      actions.addRoute(newRoute);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du parcours:', error);
    }
  };
  
  const handleAddStep = async (routeId: string) => {
    try {
      // Obtenir le SDK Matterport
      const sdkManager = window.matterportSDK;
      if (!sdkManager) {
        console.error('SDK Matterport non disponible');
        return;
      }
      
      const showcase = sdkManager.getShowcase();
      
      // Obtenir la position actuelle de la caméra
      const pose = await showcase.Camera.getPose();
      
      // Générer un ID unique
      const id = `step-${Date.now()}`;
      
      // Créer une nouvelle étape
      const newStep = {
        id,
        name: 'Nouvelle étape',
        position: pose.position,
        rotation: pose.rotation,
        duration: 5,
      };
      
      // Trouver la route
      const route = guidedNavigation.routes.find(r => r.id === routeId);
      if (!route) {
        console.error('Route non trouvée');
        return;
      }
      
      // Ajouter l'étape à la route
      actions.updateRoute(routeId, {
        steps: [...route.steps, newStep],
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'étape:', error);
    }
  };
  
  const handleStartNavigation = (routeId: string) => {
    actions.startGuidedNavigation(routeId);
  };
  
  const handleStopNavigation = () => {
    actions.stopGuidedNavigation();
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Navigation guidée</h2>
      
      <button
        onClick={handleAddRoute}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Créer un parcours
      </button>
      
      <div className="space-y-4">
        {guidedNavigation.routes.map((route) => (
          <div
            key={route.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{route.name}</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStartNavigation(route.id)}
                  className="p-1 text-green-500 hover:text-green-600"
                  disabled={guidedNavigation.isPlaying}
                >
                  Démarrer
                </button>
                <button
                  onClick={() => actions.removeRoute(route.id)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {route.description}
            </div>
            
            <div className="text-sm mb-2">
              {route.steps.length} étape(s)
            </div>
            
            <button
              onClick={() => handleAddStep(route.id)}
              className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Ajouter une étape
            </button>
            
            {route.steps.length > 0 && (
              <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                {route.steps.map((step, index) => (
                  <div key={step.id} className="mt-2 text-sm">
                    <div className="font-medium">
                      {index + 1}. {step.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Durée: {step.duration}s
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {guidedNavigation.routes.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun parcours créé
          </div>
        )}
      </div>
      
      {guidedNavigation.isPlaying && (
        <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="font-medium mb-2">
            Navigation en cours
          </div>
          <div className="flex space-x-2">
            <button
              onClick={actions.previousStep}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              disabled={guidedNavigation.currentStepIndex === 0}
            >
              Précédent
            </button>
            <button
              onClick={handleStopNavigation}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Arrêter
            </button>
            <button
              onClick={actions.nextStep}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationController;
