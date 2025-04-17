import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { ui, actions } = useAppStore();
  
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Barre latérale */}
      <aside 
        className={`w-64 bg-gray-100 dark:bg-gray-800 transition-all duration-300 ${
          ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">Matterport Customizer</h1>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => actions.setCurrentView('home')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'home' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Accueil
              </button>
            </li>
            <li>
              <button
                onClick={() => actions.setCurrentView('interface')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'interface' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Personnalisation
              </button>
            </li>
            <li>
              <button
                onClick={() => actions.setCurrentView('tags')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'tags' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Tags interactifs
              </button>
            </li>
            <li>
              <button
                onClick={() => actions.setCurrentView('objects')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'objects' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Objets 3D
              </button>
            </li>
            <li>
              <button
                onClick={() => actions.setCurrentView('media')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'media' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Médias
              </button>
            </li>
            <li>
              <button
                onClick={() => actions.setCurrentView('navigation')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'navigation' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Navigation guidée
              </button>
            </li>
            <li>
              <button
                onClick={() => actions.setCurrentView('shop')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'shop' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Boutique
              </button>
            </li>
            <li>
              <button
                onClick={() => actions.setCurrentView('analytics')}
                className={`w-full text-left px-4 py-2 rounded ${
                  ui.currentView === 'analytics' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Analyses
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Contenu principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* En-tête */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-20">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => actions.toggleSidebar()}
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => actions.setTheme(ui.theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {ui.theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
        
        {/* Contenu */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
