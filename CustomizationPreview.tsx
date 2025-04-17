import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface CustomizationPreviewProps {
  className?: string;
}

export const CustomizationPreview: React.FC<CustomizationPreviewProps> = ({ className = '' }) => {
  const { matterportConfig } = useAppStore();
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Aperçu des personnalisations</h2>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-3">Éléments d'interface</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Boutons</h4>
              <div className="space-y-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Bouton primaire
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Bouton secondaire
                </button>
                <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                  Bouton outline
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Cartes et panneaux</h4>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="font-medium">Carte exemple</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Contenu de la carte avec le style actuel
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-3">Typographie</h3>
          
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold">Titre principal (H1)</h1>
              <h2 className="text-xl font-semibold">Sous-titre (H2)</h2>
              <h3 className="text-lg font-medium">Section (H3)</h3>
              <h4 className="text-base font-medium">Sous-section (H4)</h4>
            </div>
            
            <div>
              <p className="mb-2">
                Paragraphe de texte standard avec la police et la taille actuelles.
                Ce texte montre comment le contenu principal apparaîtra dans l'application.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Texte secondaire plus petit et avec une couleur différente.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-3">Formulaires</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Champ de texte</label>
              <input
                type="text"
                placeholder="Exemple de saisie"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Sélection</label>
              <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cases à cocher</label>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input type="checkbox" id="check1" className="mr-2" />
                  <label htmlFor="check1">Option A</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="check2" className="mr-2" />
                  <label htmlFor="check2">Option B</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Boutons radio</label>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input type="radio" name="radio" id="radio1" className="mr-2" />
                  <label htmlFor="radio1">Choix 1</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="radio" id="radio2" className="mr-2" />
                  <label htmlFor="radio2">Choix 2</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-3">Thème actuel</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="font-medium mb-1">Mode</div>
              <div className="text-sm">{matterportConfig.options.theme === 'dark' ? 'Sombre' : 'Clair'}</div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Langue</div>
              <div className="text-sm">{matterportConfig.options.language === 'fr' ? 'Français' : matterportConfig.options.language}</div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Contrôles de navigation</div>
              <div className="text-sm">{matterportConfig.options.enableNavControls ? 'Activés' : 'Désactivés'}</div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Barre d'outils</div>
              <div className="text-sm">{matterportConfig.options.enableToolbar ? 'Activée' : 'Désactivée'}</div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Qualité</div>
              <div className="text-sm">
                {matterportConfig.options.quality === 'low' && 'Basse'}
                {matterportConfig.options.quality === 'medium' && 'Moyenne'}
                {matterportConfig.options.quality === 'high' && 'Haute'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPreview;
