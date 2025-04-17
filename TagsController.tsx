import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface TagsControllerProps {
  className?: string;
}

export const TagsController: React.FC<TagsControllerProps> = ({ className = '' }) => {
  const { tags, actions } = useAppStore();
  
  const handleAddTag = async () => {
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
      const id = `tag-${Date.now()}`;
      
      // Créer un nouveau tag
      const newTag = {
        id,
        label: 'Nouveau tag',
        description: 'Description du tag',
        position: pose.position,
        color: '#1E88E5',
      };
      
      // Ajouter le tag à Matterport
      await showcase.Mattertag.add({
        label: newTag.label,
        description: newTag.description,
        anchorPosition: newTag.position,
        color: newTag.color,
      });
      
      // Ajouter le tag à l'état
      actions.addTag(newTag);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error);
    }
  };
  
  const handleRemoveTag = async (id: string) => {
    try {
      // Obtenir le SDK Matterport
      const sdkManager = window.matterportSDK;
      if (!sdkManager) {
        console.error('SDK Matterport non disponible');
        return;
      }
      
      const showcase = sdkManager.getShowcase();
      
      // Supprimer le tag de Matterport
      await showcase.Mattertag.remove([id]);
      
      // Supprimer le tag de l'état
      actions.removeTag(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Tags interactifs</h2>
      
      <button
        onClick={handleAddTag}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Ajouter un tag
      </button>
      
      <div className="space-y-2">
        {tags.items.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
          >
            <div>
              <div className="font-medium">{tag.label}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{tag.description}</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => actions.selectTag(tag.id)}
                className="p-1 text-blue-500 hover:text-blue-600"
              >
                Éditer
              </button>
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="p-1 text-red-500 hover:text-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        
        {tags.items.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun tag ajouté
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsController;

// Ajouter les types au window global
declare global {
  interface Window {
    matterportSDK?: any;
  }
}
