import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface ThemeControllerProps {
  className?: string;
}

export const ThemeController: React.FC<ThemeControllerProps> = ({ className = '' }) => {
  const { ui, matterportConfig, actions } = useAppStore();
  
  const handleThemeChange = (theme: 'light' | 'dark') => {
    actions.setTheme(theme);
    
    // Mettre à jour la configuration Matterport
    actions.updateMatterportConfig({
      options: {
        ...matterportConfig.options,
        theme
      }
    });
    
    // Appliquer le thème au document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Personnalisation de l'interface</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-2">Thème</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleThemeChange('light')}
              className={`px-4 py-2 rounded ${
                ui.theme === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Clair
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-4 py-2 rounded ${
                ui.theme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Sombre
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Contrôles de navigation</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="nav-controls"
              checked={matterportConfig.options.enableNavControls}
              onChange={(e) => {
                actions.updateMatterportConfig({
                  options: {
                    ...matterportConfig.options,
                    enableNavControls: e.target.checked
                  }
                });
              }}
              className="mr-2"
            />
            <label htmlFor="nav-controls">Afficher les contrôles de navigation</label>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Barre d'outils</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="toolbar"
              checked={matterportConfig.options.enableToolbar}
              onChange={(e) => {
                actions.updateMatterportConfig({
                  options: {
                    ...matterportConfig.options,
                    enableToolbar: e.target.checked
                  }
                });
              }}
              className="mr-2"
            />
            <label htmlFor="toolbar">Afficher la barre d'outils</label>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Qualité du rendu</h3>
          <select
            value={matterportConfig.options.quality}
            onChange={(e) => {
              actions.updateMatterportConfig({
                options: {
                  ...matterportConfig.options,
                  quality: e.target.value as 'low' | 'medium' | 'high'
                }
              });
            }}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Langue</h3>
          <select
            value={matterportConfig.options.language}
            onChange={(e) => {
              actions.updateMatterportConfig({
                options: {
                  ...matterportConfig.options,
                  language: e.target.value
                }
              });
            }}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="es">Espagnol</option>
            <option value="de">Allemand</option>
            <option value="it">Italien</option>
          </select>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Affichage de la barre latérale</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sidebar"
              checked={ui.sidebarOpen}
              onChange={(e) => {
                actions.toggleSidebar();
              }}
              className="mr-2"
            />
            <label htmlFor="sidebar">Afficher la barre latérale</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeController;
