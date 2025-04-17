import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { MatterportSDKManager } from '@/lib/matterport/sdk';

interface MatterportViewerProps {
  containerId: string;
  modelId?: string;
  className?: string;
}

export const MatterportViewer: React.FC<MatterportViewerProps> = ({
  containerId,
  modelId,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { matterportConfig, actions } = useAppStore();
  
  // Utiliser le modelId fourni ou celui de la configuration
  const effectiveModelId = modelId || matterportConfig.modelId;
  
  useEffect(() => {
    if (!effectiveModelId) {
      console.error('Aucun ID de modèle Matterport fourni');
      return;
    }
    
    // Mettre à jour la configuration si un modelId est fourni
    if (modelId && modelId !== matterportConfig.modelId) {
      actions.updateMatterportConfig({ modelId });
    }
    
    // Initialiser le viewer
    const initViewer = async () => {
      try {
        actions.setLoading(true);
        
        // Créer l'iframe pour le Showcase
        if (!containerRef.current) return;
        
        // Nettoyer le conteneur
        containerRef.current.innerHTML = '';
        
        // Créer l'iframe
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'xr-spatial-tracking';
        
        // Construire l'URL du Showcase
        const showcaseUrl = new URL('https://my.matterport.com/show');
        showcaseUrl.searchParams.set('m', effectiveModelId);
        showcaseUrl.searchParams.set('play', '1');
        showcaseUrl.searchParams.set('qs', '1');
        
        // Ajouter les options de configuration
        if (!matterportConfig.options.enableNavControls) {
          showcaseUrl.searchParams.set('nt', '0');
        }
        
        if (!matterportConfig.options.enableToolbar) {
          showcaseUrl.searchParams.set('gt', '0');
        }
        
        if (matterportConfig.options.language) {
          showcaseUrl.searchParams.set('lang', matterportConfig.options.language);
        }
        
        if (matterportConfig.options.theme) {
          showcaseUrl.searchParams.set('theme', matterportConfig.options.theme);
        }
        
        iframe.src = showcaseUrl.toString();
        containerRef.current.appendChild(iframe);
        iframeRef.current = iframe;
        
        // Connecter au SDK
        const sdkManager = MatterportSDKManager.getInstance(matterportConfig);
        await sdkManager.initialize();
        
        // Attendre que l'iframe soit chargé
        iframe.onload = async () => {
          try {
            const showcase = await sdkManager.connectToShowcase(iframe);
            
            // Configurer les événements
            showcase.on('mattertagclick', (matterId: string) => {
              actions.selectTag(matterId);
            });
            
            showcase.on('positionchange', () => {
              // Gérer les changements de position pour la musique contextuelle, etc.
            });
            
            actions.setLoading(false);
          } catch (error) {
            console.error('Erreur lors de la connexion au Showcase:', error);
            actions.setLoading(false);
          }
        };
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du viewer:', error);
        actions.setLoading(false);
      }
    };
    
    initViewer();
    
    // Nettoyage
    return () => {
      if (iframeRef.current && containerRef.current) {
        containerRef.current.removeChild(iframeRef.current);
      }
    };
  }, [effectiveModelId]);
  
  return (
    <div 
      id={containerId} 
      ref={containerRef} 
      className={`w-full h-full relative ${className}`}
    >
      {matterportConfig.apiKey ? null : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
              Clé API Matterport manquante
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Veuillez configurer votre clé API Matterport pour afficher le modèle 3D.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatterportViewer;
