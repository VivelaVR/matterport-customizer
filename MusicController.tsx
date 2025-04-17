import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import AudioPlayer from '@/components/media/AudioPlayer';

interface MusicControllerProps {
  className?: string;
}

export const MusicController: React.FC<MusicControllerProps> = ({ className = '' }) => {
  const { media, actions } = useAppStore();
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  
  // Sélectionner automatiquement la première musique active si aucune n'est sélectionnée
  useEffect(() => {
    if (!selectedMusicId && media.music.length > 0) {
      const activeMusic = media.music.find(m => m.active);
      if (activeMusic) {
        setSelectedMusicId(activeMusic.id);
      } else {
        setSelectedMusicId(media.music[0].id);
      }
    }
  }, [selectedMusicId, media.music]);
  
  // Récupérer la musique sélectionnée
  const selectedMusic = selectedMusicId 
    ? media.music.find(m => m.id === selectedMusicId) 
    : null;
  
  // Gérer le changement de volume global
  const handleGlobalVolumeChange = (volume: number) => {
    actions.updateMediaSettings({
      ...media.settings,
      globalMusicVolume: volume
    });
  };
  
  return (
    <div className={`music-controller ${className}`}>
      <h2 className="text-lg font-medium mb-4">Contrôleur de musique</h2>
      
      {media.music.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucune musique n'a été ajoutée. Ajoutez de la musique dans l'onglet "Musique".
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Volume global de la musique: {media.settings.globalMusicVolume}%
              </label>
              <input
                type="range"
                value={media.settings.globalMusicVolume}
                onChange={(e) => handleGlobalVolumeChange(parseInt(e.target.value))}
                min="0"
                max="100"
                step="1"
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Sélectionner une musique</label>
              <select
                value={selectedMusicId || ''}
                onChange={(e) => setSelectedMusicId(e.target.value || null)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Sélectionner une musique</option>
                {media.music.map(music => (
                  <option key={music.id} value={music.id}>
                    {music.title} {music.active ? '(Active)' : '(Inactive)'}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedMusic && (
              <div className="mt-4">
                <AudioPlayer
                  audioUrl={selectedMusic.url}
                  autoplay={selectedMusic.autoplay && selectedMusic.active}
                  loop={selectedMusic.loop}
                  volume={selectedMusic.volume}
                  controls={true}
                  onError={(error) => console.error('Erreur de lecture audio:', error)}
                />
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
            <h3 className="text-md font-medium mb-2">Musiques actives</h3>
            
            {media.music.filter(m => m.active).length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Aucune musique active. Activez une musique dans l'onglet "Musique".
              </div>
            ) : (
              <div className="space-y-2">
                {media.music.filter(m => m.active).map(music => (
                  <div 
                    key={music.id}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{music.title}</div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            actions.updateMusic(music.id, { ...music, active: false });
                          }}
                          className="p-1 text-red-500 hover:text-red-600"
                          title="Désactiver"
                        >
                          🔇
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Volume: {music.volume}%
                      </label>
                      <input
                        type="range"
                        value={music.volume}
                        onChange={(e) => {
                          actions.updateMusic(music.id, { 
                            ...music, 
                            volume: parseInt(e.target.value) 
                          });
                        }}
                        min="0"
                        max="100"
                        step="1"
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicController;
