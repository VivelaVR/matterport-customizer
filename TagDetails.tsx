import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface TagDetailsProps {
  className?: string;
}

export const TagDetails: React.FC<TagDetailsProps> = ({ className = '' }) => {
  const { tags, actions } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTagData, setNewTagData] = useState({
    label: 'Nouveau tag',
    description: 'Description du tag',
    color: '#1E88E5',
    iconUrl: '',
    mediaType: 'none',
    mediaUrl: '',
    link: '',
  });
  
  const handleCreateTag = async () => {
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
        label: newTagData.label,
        description: newTagData.description,
        position: pose.position,
        color: newTagData.color,
        iconUrl: newTagData.iconUrl || undefined,
        media: newTagData.mediaType !== 'none' ? {
          type: newTagData.mediaType as 'image' | 'video',
          url: newTagData.mediaUrl
        } : undefined,
        link: newTagData.link || undefined,
      };
      
      // Ajouter le tag à Matterport
      await showcase.Mattertag.add({
        label: newTag.label,
        description: newTag.description,
        anchorPosition: newTag.position,
        color: newTag.color,
        ...(newTag.iconUrl ? { iconUrl: newTag.iconUrl } : {}),
      });
      
      // Ajouter le tag à l'état
      actions.addTag(newTag);
      
      // Réinitialiser le formulaire
      setIsCreating(false);
      setNewTagData({
        label: 'Nouveau tag',
        description: 'Description du tag',
        color: '#1E88E5',
        iconUrl: '',
        mediaType: 'none',
        mediaUrl: '',
        link: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création du tag:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTagData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Détails des tags</h2>
      
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Créer un nouveau tag
        </button>
      )}
      
      {isCreating && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-md font-medium mb-3">Créer un nouveau tag</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Libellé</label>
              <input
                type="text"
                name="label"
                value={newTagData.label}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={newTagData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Couleur</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="color"
                  value={newTagData.color}
                  onChange={handleChange}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="color"
                  value={newTagData.color}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL de l'icône (optionnel)</label>
              <input
                type="url"
                name="iconUrl"
                value={newTagData.iconUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="https://exemple.com/icone.png"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Média</label>
              <select
                name="mediaType"
                value={newTagData.mediaType}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
              >
                <option value="none">Aucun</option>
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
              </select>
              
              {newTagData.mediaType !== 'none' && (
                <input
                  type="url"
                  name="mediaUrl"
                  value={newTagData.mediaUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder={`URL de ${newTagData.mediaType === 'image' ? 'l\'image' : 'la vidéo'}`}
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Lien (optionnel)</label>
              <input
                type="url"
                name="link"
                value={newTagData.link}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="https://exemple.com"
              />
            </div>
            
            <div className="pt-2 flex space-x-2">
              <button
                onClick={handleCreateTag}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Créer le tag
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
        {tags.items.map((tag) => (
          <div
            key={tag.id}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: tag.color }}
                ></div>
                {tag.label}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => actions.selectTag(tag.id)}
                  className="p-1 text-blue-500 hover:text-blue-600"
                >
                  Éditer
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Obtenir le SDK Matterport
                      const sdkManager = window.matterportSDK;
                      if (!sdkManager) {
                        console.error('SDK Matterport non disponible');
                        return;
                      }
                      
                      const showcase = sdkManager.getShowcase();
                      
                      // Supprimer le tag de Matterport
                      await showcase.Mattertag.remove([tag.id]);
                      
                      // Supprimer le tag de l'état
                      actions.removeTag(tag.id);
                    } catch (error) {
                      console.error('Erreur lors de la suppression du tag:', error);
                    }
                  }}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {tag.description}
            </div>
            
            {tag.media && (
              <div className="mb-2">
                <div className="text-sm font-medium">Média:</div>
                <div className="text-sm text-blue-500">
                  {tag.media.type === 'image' ? 'Image' : 'Vidéo'}: {tag.media.url}
                </div>
              </div>
            )}
            
            {tag.link && (
              <div className="mb-2">
                <div className="text-sm font-medium">Lien:</div>
                <a 
                  href={tag.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {tag.link}
                </a>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              ID: {tag.id}
            </div>
          </div>
        ))}
        
        {tags.items.length === 0 && !isCreating && (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            Aucun tag ajouté. Cliquez sur "Créer un nouveau tag" pour commencer.
          </div>
        )}
      </div>
    </div>
  );
};

export default TagDetails;
