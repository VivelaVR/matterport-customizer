import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface AnalyticsSettingsProps {
  className?: string;
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({ className = '' }) => {
  const { analytics, actions } = useAppStore();
  const [settings, setSettings] = useState({
    trackingEnabled: analytics.settings.trackingEnabled,
    trackingMode: analytics.settings.trackingMode,
    trackClicks: analytics.settings.trackClicks,
    trackViews: analytics.settings.trackViews,
    trackPaths: analytics.settings.trackPaths,
    trackDwellTime: analytics.settings.trackDwellTime,
    anonymizeData: analytics.settings.anonymizeData,
    retentionPeriod: analytics.settings.retentionPeriod,
    exportEnabled: analytics.settings.exportEnabled,
    exportFormat: analytics.settings.exportFormat
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSaveSettings = () => {
    try {
      // Mettre à jour les paramètres dans l'état
      actions.updateAnalyticsSettings(settings);
      
      // Note: L'application réelle des paramètres dans la scène Matterport nécessite
      // l'utilisation du SDK Bundle et sera implémentée dans une étape ultérieure
      console.log('Mise à jour des paramètres d\'analyse dans Matterport:', settings);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres d\'analyse:', error);
    }
  };
  
  return (
    <div className={`analytics-settings ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="trackingEnabled" className="text-sm font-medium">
            Activer le suivi analytique
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id="trackingEnabled"
              name="trackingEnabled"
              checked={settings.trackingEnabled}
              onChange={handleChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="trackingEnabled"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                settings.trackingEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            ></label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Mode de suivi
          </label>
          <select
            name="trackingMode"
            value={settings.trackingMode}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            disabled={!settings.trackingEnabled}
          >
            <option value="basic">Basique (vues et clics uniquement)</option>
            <option value="standard">Standard (vues, clics, chemins)</option>
            <option value="advanced">Avancé (toutes les métriques)</option>
            <option value="custom">Personnalisé</option>
          </select>
        </div>
        
        {settings.trackingMode === 'custom' && (
          <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="trackClicks"
                name="trackClicks"
                checked={settings.trackClicks}
                onChange={handleChange}
                className="mr-2"
                disabled={!settings.trackingEnabled}
              />
              <label htmlFor="trackClicks">Suivre les clics</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="trackViews"
                name="trackViews"
                checked={settings.trackViews}
                onChange={handleChange}
                className="mr-2"
                disabled={!settings.trackingEnabled}
              />
              <label htmlFor="trackViews">Suivre les vues</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="trackPaths"
                name="trackPaths"
                checked={settings.trackPaths}
                onChange={handleChange}
                className="mr-2"
                disabled={!settings.trackingEnabled}
              />
              <label htmlFor="trackPaths">Suivre les chemins</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="trackDwellTime"
                name="trackDwellTime"
                checked={settings.trackDwellTime}
                onChange={handleChange}
                className="mr-2"
                disabled={!settings.trackingEnabled}
              />
              <label htmlFor="trackDwellTime">Suivre le temps passé</label>
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymizeData"
            name="anonymizeData"
            checked={settings.anonymizeData}
            onChange={handleChange}
            className="mr-2"
            disabled={!settings.trackingEnabled}
          />
          <label htmlFor="anonymizeData">Anonymiser les données</label>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Période de conservation des données
          </label>
          <select
            name="retentionPeriod"
            value={settings.retentionPeriod}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            disabled={!settings.trackingEnabled}
          >
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="180d">180 jours</option>
            <option value="365d">1 an</option>
            <option value="forever">Indéfiniment</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <label htmlFor="exportEnabled" className="text-sm font-medium">
            Activer l'exportation des données
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id="exportEnabled"
              name="exportEnabled"
              checked={settings.exportEnabled}
              onChange={handleChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              disabled={!settings.trackingEnabled}
            />
            <label
              htmlFor="exportEnabled"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                settings.exportEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            ></label>
          </div>
        </div>
        
        {settings.exportEnabled && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Format d'exportation
            </label>
            <select
              name="exportFormat"
              value={settings.exportFormat}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              disabled={!settings.trackingEnabled || !settings.exportEnabled}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        )}
        
        <div className="pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            disabled={!settings.trackingEnabled}
          >
            Enregistrer les paramètres
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium mb-3">Confidentialité et conformité</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">RGPD</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Les données collectées sont conformes au Règlement Général sur la Protection des Données (RGPD).
                Lorsque l'anonymisation est activée, aucune donnée personnelle identifiable n'est stockée.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Cookies</h4>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Cette application utilise des cookies techniques nécessaires à son fonctionnement.
                Les cookies analytiques ne sont utilisés que si le suivi est activé.
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">Sécurité des données</h4>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Toutes les données analytiques sont chiffrées en transit et au repos.
                L'accès aux données est limité aux utilisateurs autorisés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSettings;
