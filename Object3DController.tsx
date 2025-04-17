import React, { useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface Object3DControllerProps {
  className?: string;
}

export const Object3DController: React.FC<Object3DControllerProps> = ({ className = '' }) => {
  const { objects3D, actions } = useAppStore();
  
  // Synchroniser les objets 3D avec Matterport lors du chargement du composant
  useEffect(() => {
    const syncObjects = async () => {
      try {
        // Obtenir le SDK Matterport
        const sdkManager = window.matterportSDK;
        if (!sdkManager) {
          console.error('SDK Matterport non disponible');
          return;
        }
        
        const showcase = sdkManager.getShowcase();
        
        // Note: L'implémentation réelle dépend de l'API Matterport pour les objets 3D
        // Cette partie sera complétée lorsque nous aurons accès à l'API complète
        console.log('Synchronisation des objets 3D avec Matterport');
        
        // Exemple de synchronisation (simulée)
        objects3D.items.forEach(object => {
          console.log(`Synchronisation de l'objet ${object.id} avec Matterport`);
        });
      } catch (error) {
        console.error('Erreur lors de la synchronisation des objets 3D:', error);
      }
    };
    
    syncObjects();
  }, [objects3D.items]);
  
  // Gérer la sélection d'un objet
  const handleSelectObject = (id: string) => {
    actions.selectObject3D(id);
    useAppStore.setState(state => {
      state.ui.objects3DTab = 'edit';
    });
  };
  
  // Gérer la suppression d'un objet
  const handleDeleteObject = (id: string) => {
    try {
      // Obtenir le SDK Matterport
      const sdkManager = window.matterportSDK;
      if (sdkManager) {
        const showcase = sdkManager.getShowcase();
        
        // Note: L'implémentation réelle dépend de l'API Matterport pour les objets 3D
        // Cette partie sera complétée lorsque nous aurons accès à l'API complète
        console.log(`Suppression de l'objet ${id} de Matterport`);
      }
      
      // Supprimer l'objet de l'état
      actions.removeObject3D(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'objet 3D:', error);
    }
  };
  
  // Gérer la visibilité d'un objet
  const handleToggleVisibility = (id: string, visible: boolean) => {
    try {
      // Obtenir le SDK Matterport
      const sdkManager = window.matterportSDK;
      if (sdkManager) {
        const showcase = sdkManager.getShowcase();
        
        // Note: L'implémentation réelle dépend de l'API Matterport pour les objets 3D
        // Cette partie sera complétée lorsque nous aurons accès à l'API complète
        console.log(`Modification de la visibilité de l'objet ${id} dans Matterport: ${visible}`);
      }
      
      // Mettre à jour l'objet dans l'état
      const object = objects3D.items.find(obj => obj.id === id);
      if (object) {
        actions.updateObject3D(id, { ...object, visible });
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité de l\'objet 3D:', error);
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Objets 3D</h2>
        
        <button
          onClick={() => {
            useAppStore.setState(state => {
              state.ui.objects3DTab = 'library';
            });
          }}
          className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
        >
          Ajouter un objet
        </button>
      </div>
      
      {objects3D.items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucun objet 3D n'a encore été ajouté. Utilisez la bibliothèque pour ajouter des objets.
        </div>
      ) : (
        <div className="space-y-3">
          {objects3D.items.map(object => (
            <div 
              key={object.id}
              className={`p-3 rounded-lg border ${object.visible ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-800'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{object.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {object.modelUrl.split('/').pop()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleVisibility(object.id, !object.visible)}
                    className={`p-1 rounded ${object.visible ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'}`}
                    title={object.visible ? 'Masquer' : 'Afficher'}
                  >
                    {object.visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  
                  <button
                    onClick={() => handleSelectObject(object.id)}
                    className="p-1 text-blue-500 hover:text-blue-600"
                    title="Éditer"
                  >
                    ✏️
                  </button>
                  
                  <button
                    onClick={() => handleDeleteObject(object.id)}
                    className="p-1 text-red-500 hover:text-red-600"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <div className="font-medium">Position</div>
                  <div>X: {object.position.x.toFixed(2)}</div>
                  <div>Y: {object.position.y.toFixed(2)}</div>
                  <div>Z: {object.position.z.toFixed(2)}</div>
                </div>
                <div>
                  <div className="font-medium">Rotation</div>
                  <div>X: {object.rotation.x}°</div>
                  <div>Y: {object.rotation.y}°</div>
                  <div>Z: {object.rotation.z}°</div>
                </div>
                <div>
                  <div className="font-medium">Échelle</div>
                  <div>X: {object.scale.x}</div>
                  <div>Y: {object.scale.y}</div>
                  <div>Z: {object.scale.z}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Object3DController;
