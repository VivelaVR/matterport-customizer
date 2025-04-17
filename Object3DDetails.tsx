import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface Object3DDetailsProps {
  className?: string;
}

export const Object3DDetails: React.FC<Object3DDetailsProps> = ({ className = '' }) => {
  const { objects3D, actions } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newObjectData, setNewObjectData] = useState({
    name: 'Nouvel objet',
    modelUrl: '/models/default-cube.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    visible: true,
  });
  
  const handleCreateObject = async () => {
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
      const id = `object-${Date.now()}`;
      
      // Créer un nouvel objet 3D
      const newObject = {
        id,
        name: newObjectData.name,
        modelUrl: newObjectData.modelUrl,
        position: pose.position, // Utiliser la position de la caméra
        rotation: newObjectData.rotation,
        scale: newObjectData.scale,
        visible: newObjectData.visible,
      };
      
      // Ajouter l'objet à l'état
      actions.addObject3D(newObject);
      
      // Note: L'ajout réel de l'objet 3D à la scène Matterport nécessite
      // l'utilisation du SDK Bundle et sera implémenté dans une étape ultérieure
      console.log('Ajout de l\'objet 3D à Matterport:', newObject);
      
      // Réinitialiser le formulaire
      setIsCreating(false);
      setNewObjectData({
        name: 'Nouvel objet',
        modelUrl: '/models/default-cube.glb',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: true,
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'objet 3D:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setNewObjectData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('.')) {
      // Gérer les propriétés imbriquées (position, rotation, scale)
      const [parent, child] = name.split('.');
      setNewObjectData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: parseFloat(value)
        }
      }));
    } else {
      setNewObjectData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Détails des objets 3D</h2>
      
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Créer un nouvel objet
        </button>
      )}
      
      {isCreating && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-md font-medium mb-3">Créer un nouvel objet 3D</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={newObjectData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL du modèle 3D</label>
              <input
                type="text"
                name="modelUrl"
                value={newObjectData.modelUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formats supportés: GLB, GLTF
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Échelle</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs mb-1">X</label>
                  <input
                    type="number"
                    name="scale.x"
                    value={newObjectData.scale.x}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Y</label>
                  <input
                    type="number"
                    name="scale.y"
                    value={newObjectData.scale.y}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Z</label>
                  <input
                    type="number"
                    name="scale.z"
                    value={newObjectData.scale.z}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Rotation (degrés)</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs mb-1">X</label>
                  <input
                    type="number"
                    name="rotation.x"
                    value={newObjectData.rotation.x}
                    onChange={handleChange}
                    step="1"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Y</label>
                  <input
                    type="number"
                    name="rotation.y"
                    value={newObjectData.rotation.y}
                    onChange={handleChange}
                    step="1"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Z</label>
                  <input
                    type="number"
                    name="rotation.z"
                    value={newObjectData.rotation.z}
                    onChange={handleChange}
                    step="1"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="visible"
                name="visible"
                checked={newObjectData.visible}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="visible">Visible</label>
            </div>
            
            <div className="pt-2 flex space-x-2">
              <button
                onClick={handleCreateObject}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Créer l'objet
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {objects3D.items.map((object) => (
          <div
            key={object.id}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{object.name}</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => actions.selectObject3D(object.id)}
                  className="p-1 text-blue-500 hover:text-blue-600"
                >
                  Éditer
                </button>
                <button
                  onClick={() => {
                    // Supprimer l'objet 3D
                    actions.removeObject3D(object.id);
                    
                    // Note: La suppression réelle de l'objet 3D de la scène Matterport nécessite
                    // l'utilisation du SDK Bundle et sera implémentée dans une étape ultérieure
                    console.log('Suppression de l\'objet 3D de Matterport:', object.id);
                  }}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Modèle: {object.modelUrl}
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
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
            
            <div className="mt-2 text-xs">
              <span className={`px-2 py-1 rounded ${object.visible ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {object.visible ? 'Visible' : 'Masqué'}
              </span>
            </div>
          </div>
        ))}
        
        {objects3D.items.length === 0 && !isCreating && (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun objet 3D ajouté. Cliquez sur "Créer un nouvel objet" pour commencer.
          </div>
        )}
      </div>
    </div>
  );
};

export default Object3DDetails;
