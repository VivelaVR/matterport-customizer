import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface AnalyticsEventsProps {
  className?: string;
  filter?: 'all' | 'view' | 'click' | 'hover' | 'tag_click' | 'object_view';
}

export const AnalyticsEvents: React.FC<AnalyticsEventsProps> = ({ 
  className = '', 
  filter = 'all'
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentFilter, setCurrentFilter] = useState(filter);
  
  // Générer des événements simulés
  useEffect(() => {
    const generateEvents = () => {
      const eventTypes = ['view', 'click', 'hover', 'tag_click', 'object_view'];
      const areas = ['Entrée', 'Salon', 'Cuisine', 'Chambre', 'Salle de bain'];
      const tags = ['Info produit', 'Prix', 'Dimensions', 'Matériaux', 'Couleurs'];
      const objects = ['Canapé', 'Table', 'Chaise', 'Lit', 'Lampe', 'Télévision'];
      
      const generatedEvents = [];
      
      // Générer 50 événements aléatoires
      for (let i = 0; i < 50; i++) {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const timestamp = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
        
        let details;
        if (eventType === 'view' || eventType === 'hover') {
          details = {
            area: areas[Math.floor(Math.random() * areas.length)],
            duration: Math.floor(Math.random() * 60) + 5
          };
        } else if (eventType === 'click') {
          details = {
            position: {
              x: Math.floor(Math.random() * 400),
              y: Math.floor(Math.random() * 300),
              z: Math.floor(Math.random() * 200)
            }
          };
        } else if (eventType === 'tag_click') {
          details = {
            tag: tags[Math.floor(Math.random() * tags.length)],
            area: areas[Math.floor(Math.random() * areas.length)]
          };
        } else if (eventType === 'object_view') {
          details = {
            object: objects[Math.floor(Math.random() * objects.length)],
            duration: Math.floor(Math.random() * 30) + 2
          };
        }
        
        generatedEvents.push({
          id: `event-${i}`,
          type: eventType,
          timestamp,
          details
        });
      }
      
      // Trier par date décroissante
      generatedEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setEvents(generatedEvents);
    };
    
    generateEvents();
  }, []);
  
  // Mettre à jour le filtre
  useEffect(() => {
    setCurrentFilter(filter);
  }, [filter]);
  
  // Filtrer les événements
  const filteredEvents = currentFilter === 'all' 
    ? events 
    : events.filter(event => event.type === currentFilter);
  
  // Formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Obtenir la description de l'événement
  const getEventDescription = (event: any) => {
    switch (event.type) {
      case 'view':
        return `Vue de la zone "${event.details.area}" pendant ${event.details.duration} secondes`;
      case 'click':
        return `Clic à la position (${event.details.position.x}, ${event.details.position.y}, ${event.details.position.z})`;
      case 'hover':
        return `Survol de la zone "${event.details.area}" pendant ${event.details.duration} secondes`;
      case 'tag_click':
        return `Clic sur le tag "${event.details.tag}" dans la zone "${event.details.area}"`;
      case 'object_view':
        return `Vue de l'objet "${event.details.object}" pendant ${event.details.duration} secondes`;
      default:
        return 'Événement inconnu';
    }
  };
  
  // Obtenir la couleur de l'événement
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'view':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'click':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'hover':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'tag_click':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'object_view':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  // Exporter les événements au format CSV
  const exportEvents = () => {
    // Créer l'en-tête CSV
    let csv = 'ID,Type,Date,Description\n';
    
    // Ajouter chaque événement
    filteredEvents.forEach(event => {
      csv += `${event.id},${event.type},${formatDate(event.timestamp)},"${getEventDescription(event)}"\n`;
    });
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `events_${currentFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={`analytics-events ${className}`}>
      <div className="mb-3 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Affichage de {filteredEvents.length} événements {currentFilter !== 'all' ? `de type "${currentFilter}"` : ''}.
        </div>
        
        <button
          onClick={exportEvents}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          disabled={filteredEvents.length === 0}
        >
          Exporter CSV
        </button>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredEvents.map(event => (
          <div 
            key={event.id}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(event.timestamp)}
                </div>
                <div className="font-medium mt-1">
                  {getEventDescription(event)}
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs ${getEventColor(event.type)}`}>
                {event.type}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucun événement trouvé avec les filtres actuels.
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-medium mb-2">Statistiques des événements</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {['view', 'click', 'hover', 'tag_click', 'object_view'].map(type => {
            const count = events.filter(e => e.type === type).length;
            const percentage = Math.round((count / events.length) * 100);
            
            return (
              <div 
                key={type}
                className={`p-2 rounded-lg text-center ${getEventColor(type)}`}
              >
                <div className="text-xs uppercase font-medium">{type}</div>
                <div className="text-lg font-bold">{count}</div>
                <div className="text-xs">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsEvents;
