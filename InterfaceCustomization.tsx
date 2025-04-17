import React, { useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface InterfaceCustomizationProps {
  className?: string;
}

export const InterfaceCustomization: React.FC<InterfaceCustomizationProps> = ({ className = '' }) => {
  const { matterportConfig, actions } = useAppStore();
  
  // Appliquer le thème au chargement du composant
  useEffect(() => {
    const applyTheme = () => {
      if (matterportConfig.options.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    applyTheme();
  }, [matterportConfig.options.theme]);
  
  // Gérer les changements de couleur primaire
  const handlePrimaryColorChange = (color: string) => {
    // Mettre à jour les variables CSS pour la couleur primaire
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--color-primary-hover', adjustColor(color, -10));
    document.documentElement.style.setProperty('--color-primary-light', adjustColor(color, 40));
  };
  
  // Gérer les changements de couleur secondaire
  const handleSecondaryColorChange = (color: string) => {
    // Mettre à jour les variables CSS pour la couleur secondaire
    document.documentElement.style.setProperty('--color-secondary', color);
    document.documentElement.style.setProperty('--color-secondary-hover', adjustColor(color, -10));
    document.documentElement.style.setProperty('--color-secondary-light', adjustColor(color, 40));
  };
  
  // Fonction pour ajuster la luminosité d'une couleur
  const adjustColor = (color: string, amount: number): string => {
    // Convertir la couleur hex en RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Ajuster la luminosité
    const adjustR = Math.max(0, Math.min(255, r + amount));
    const adjustG = Math.max(0, Math.min(255, g + amount));
    const adjustB = Math.max(0, Math.min(255, b + amount));
    
    // Convertir en hex
    return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Personnalisation avancée de l'interface</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Couleurs de l'interface</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Couleur primaire</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value="#1E88E5"
                  onChange={(e) => handlePrimaryColorChange(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm">Utilisée pour les boutons et éléments principaux</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Couleur secondaire</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value="#6C757D"
                  onChange={(e) => handleSecondaryColorChange(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm">Utilisée pour les éléments secondaires</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Polices de caractères</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Police principale</label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => {
                  document.documentElement.style.setProperty('--font-primary', e.target.value);
                }}
              >
                <option value="'Inter', sans-serif">Inter (Par défaut)</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
                <option value="'Poppins', sans-serif">Poppins</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Taille de police</label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => {
                  document.documentElement.style.setProperty('--font-size-base', e.target.value);
                }}
              >
                <option value="14px">Petite (14px)</option>
                <option value="16px" selected>Moyenne (16px)</option>
                <option value="18px">Grande (18px)</option>
                <option value="20px">Très grande (20px)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Arrondis et ombres</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rayon des coins</label>
              <input
                type="range"
                min="0"
                max="20"
                defaultValue="4"
                onChange={(e) => {
                  document.documentElement.style.setProperty('--border-radius', `${e.target.value}px`);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>Carré</span>
                <span>Arrondi</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Intensité des ombres</label>
              <input
                type="range"
                min="0"
                max="30"
                defaultValue="15"
                onChange={(e) => {
                  const value = e.target.value;
                  document.documentElement.style.setProperty('--shadow-sm', `0 1px ${value/10}px rgba(0, 0, 0, 0.05)`);
                  document.documentElement.style.setProperty('--shadow-md', `0 4px ${value/5}px rgba(0, 0, 0, 0.1)`);
                  document.documentElement.style.setProperty('--shadow-lg', `0 10px ${value/3}px rgba(0, 0, 0, 0.15)`);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>Subtiles</span>
                <span>Prononcées</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Animations et transitions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vitesse des transitions</label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => {
                  document.documentElement.style.setProperty('--transition-speed', e.target.value);
                }}
              >
                <option value="0.1s">Rapide (0.1s)</option>
                <option value="0.2s" selected>Moyenne (0.2s)</option>
                <option value="0.3s">Lente (0.3s)</option>
                <option value="0.5s">Très lente (0.5s)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Animations</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable-animations"
                  defaultChecked
                  onChange={(e) => {
                    if (e.target.checked) {
                      document.documentElement.classList.remove('no-animations');
                    } else {
                      document.documentElement.classList.add('no-animations');
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor="enable-animations">Activer les animations</label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Disposition des éléments</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Espacement des éléments</label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => {
                  document.documentElement.style.setProperty('--spacing-base', e.target.value);
                }}
              >
                <option value="0.5rem">Compact (0.5rem)</option>
                <option value="1rem" selected>Standard (1rem)</option>
                <option value="1.5rem">Aéré (1.5rem)</option>
                <option value="2rem">Très aéré (2rem)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Largeur de la barre latérale</label>
              <input
                type="range"
                min="200"
                max="400"
                defaultValue="256"
                onChange={(e) => {
                  document.documentElement.style.setProperty('--sidebar-width', `${e.target.value}px`);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>Étroite</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              // Réinitialiser toutes les variables CSS
              document.documentElement.removeAttribute('style');
              document.documentElement.classList.remove('no-animations');
              
              // Réinitialiser le thème
              if (matterportConfig.options.theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Réinitialiser tous les styles
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterfaceCustomization;
