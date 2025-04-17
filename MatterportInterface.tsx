import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface MatterportInterfaceProps {
  className?: string;
}

export const MatterportInterface: React.FC<MatterportInterfaceProps> = ({ className = '' }) => {
  const { matterportConfig, actions } = useAppStore();
  
  // Gérer les changements de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        actions.updateMatterportConfig({
          customInterface: {
            ...matterportConfig.customInterface,
            logoUrl
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Personnalisation de l'interface Matterport</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Logo personnalisé</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                {matterportConfig.customInterface?.logoUrl ? (
                  <img 
                    src={matterportConfig.customInterface.logoUrl} 
                    alt="Logo personnalisé" 
                    className="max-w-full max-h-full"
                  />
                ) : (
                  <span className="text-gray-400">Logo</span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Choisir un logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-gray-700 dark:file:text-gray-200"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-logo"
                checked={matterportConfig.customInterface?.showLogo ?? true}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      showLogo: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="show-logo">Afficher le logo</label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Couleurs de l'interface Matterport</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Couleur d'accentuation</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={matterportConfig.customInterface?.accentColor || '#1E88E5'}
                  onChange={(e) => {
                    actions.updateMatterportConfig({
                      customInterface: {
                        ...matterportConfig.customInterface,
                        accentColor: e.target.value
                      }
                    });
                  }}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm">Couleur des boutons et éléments interactifs</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Couleur des tags</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={matterportConfig.tags.defaultStyle.color}
                  onChange={(e) => {
                    actions.updateMatterportConfig({
                      tags: {
                        ...matterportConfig.tags,
                        defaultStyle: {
                          ...matterportConfig.tags.defaultStyle,
                          color: e.target.value
                        }
                      }
                    });
                  }}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm">Couleur par défaut des tags interactifs</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Éléments d'interface</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-help"
                checked={matterportConfig.customInterface?.showHelp ?? true}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      showHelp: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="show-help">Afficher le bouton d'aide</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-share"
                checked={matterportConfig.customInterface?.showShare ?? true}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      showShare: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="show-share">Afficher le bouton de partage</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-vr"
                checked={matterportConfig.customInterface?.showVR ?? true}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      showVR: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="show-vr">Afficher le bouton VR</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-dollhouse"
                checked={matterportConfig.customInterface?.showDollhouse ?? true}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      showDollhouse: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="show-dollhouse">Afficher le mode Dollhouse</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-measurements"
                checked={matterportConfig.customInterface?.showMeasurements ?? true}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      showMeasurements: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="show-measurements">Afficher l'outil de mesure</label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Textes personnalisés</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Titre du modèle</label>
              <input
                type="text"
                value={matterportConfig.customInterface?.title || ''}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      title: e.target.value
                    }
                  });
                }}
                placeholder="Titre affiché dans l'interface"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message de bienvenue</label>
              <textarea
                value={matterportConfig.customInterface?.welcomeMessage || ''}
                onChange={(e) => {
                  actions.updateMatterportConfig({
                    customInterface: {
                      ...matterportConfig.customInterface,
                      welcomeMessage: e.target.value
                    }
                  });
                }}
                placeholder="Message affiché au démarrage"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-24"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              // Réinitialiser la configuration de l'interface
              actions.updateMatterportConfig({
                customInterface: undefined
              });
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Réinitialiser l'interface Matterport
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatterportInterface;
