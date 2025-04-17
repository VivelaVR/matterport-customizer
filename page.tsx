import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import MatterportViewer from '@/components/matterport/MatterportViewer';
import ThemeController from '@/components/ui/ThemeController';
import InterfaceCustomization from '@/components/ui/InterfaceCustomization';
import CustomizationPreview from '@/components/ui/CustomizationPreview';
import MatterportInterface from '@/components/ui/MatterportInterface';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  const { ui } = useAppStore();
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row h-full gap-4">
        <div className="w-full md:w-2/3 h-[500px] md:h-full rounded-lg overflow-hidden shadow-lg">
          <MatterportViewer containerId="matterport-viewer" />
        </div>
        
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto">
          {ui.currentView === 'home' && (
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">Bienvenue sur Matterport Customizer</h1>
              <p className="mb-4">
                Cette application vous permet de personnaliser vos jumeaux numériques Matterport avec de nombreuses fonctionnalités :
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Personnalisation de l'interface</li>
                <li>Ajout de tags interactifs</li>
                <li>Intégration d'objets 3D</li>
                <li>Intégration de vidéos et de musique</li>
                <li>Outils d'analyse de performance</li>
                <li>Boutique en ligne avec achat direct</li>
                <li>Mode de navigation guidée</li>
              </ul>
              <p>
                Utilisez le menu de gauche pour accéder aux différentes fonctionnalités.
              </p>
            </div>
          )}
          
          {ui.currentView === 'interface' && (
            <div className="tabs-container">
              <div className="flex border-b">
                <button 
                  className={`px-4 py-2 ${ui.interfaceTab === 'basic' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                  onClick={() => useAppStore.setState(state => {
                    state.ui.interfaceTab = 'basic';
                  })}
                >
                  Basique
                </button>
                <button 
                  className={`px-4 py-2 ${ui.interfaceTab === 'advanced' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                  onClick={() => useAppStore.setState(state => {
                    state.ui.interfaceTab = 'advanced';
                  })}
                >
                  Avancé
                </button>
                <button 
                  className={`px-4 py-2 ${ui.interfaceTab === 'matterport' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                  onClick={() => useAppStore.setState(state => {
                    state.ui.interfaceTab = 'matterport';
                  })}
                >
                  Matterport
                </button>
                <button 
                  className={`px-4 py-2 ${ui.interfaceTab === 'preview' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                  onClick={() => useAppStore.setState(state => {
                    state.ui.interfaceTab = 'preview';
                  })}
                >
                  Aperçu
                </button>
              </div>
              
              <div className="tab-content">
                {ui.interfaceTab === 'basic' && <ThemeController />}
                {ui.interfaceTab === 'advanced' && <InterfaceCustomization />}
                {ui.interfaceTab === 'matterport' && <MatterportInterface />}
                {ui.interfaceTab === 'preview' && <CustomizationPreview />}
              </div>
            </div>
          )}
          
          {/* Les autres vues seront implémentées dans les prochaines étapes */}
        </div>
      </div>
    </MainLayout>
  );
}
