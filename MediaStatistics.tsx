import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import VideoPlayer from '@/components/media/VideoPlayer';
import AudioPlayer from '@/components/media/AudioPlayer';
import VideoPreview from '@/components/media/VideoPreview';
import MusicController from '@/components/media/MusicController';
import MediaPositioner from '@/components/media/MediaPositioner';

interface MediaStatisticsProps {
  className?: string;
}

export const MediaStatistics: React.FC<MediaStatisticsProps> = ({ className = '' }) => {
  const { media } = useAppStore();
  const [stats, setStats] = useState({
    totalVideos: 0,
    activeVideos: 0,
    totalMusic: 0,
    activeMusic: 0,
    videoFormats: {} as Record<string, number>,
    musicFormats: {} as Record<string, number>,
    averageVideoVolume: 0,
    averageMusicVolume: 0,
  });
  
  // Calculer les statistiques lorsque les médias changent
  useEffect(() => {
    const videoFormats: Record<string, number> = {};
    const musicFormats: Record<string, number> = {};
    let totalVideoVolume = 0;
    let totalMusicVolume = 0;
    
    // Analyser les vidéos
    media.videos.forEach(video => {
      // Compter par format
      const format = video.url.split('.').pop()?.toLowerCase() || 'unknown';
      videoFormats[format] = (videoFormats[format] || 0) + 1;
      
      // Calculer le volume moyen (pour les vidéos non muettes)
      if (!video.muted) {
        totalVideoVolume += 100; // Volume par défaut à 100%
      }
    });
    
    // Analyser la musique
    media.music.forEach(music => {
      // Compter par format
      const format = music.url.split('.').pop()?.toLowerCase() || 'unknown';
      musicFormats[format] = (musicFormats[format] || 0) + 1;
      
      // Calculer le volume moyen
      totalMusicVolume += music.volume;
    });
    
    setStats({
      totalVideos: media.videos.length,
      activeVideos: media.videos.filter(v => v.active).length,
      totalMusic: media.music.length,
      activeMusic: media.music.filter(m => m.active).length,
      videoFormats,
      musicFormats,
      averageVideoVolume: media.videos.length > 0 ? Math.round(totalVideoVolume / media.videos.length) : 0,
      averageMusicVolume: media.music.length > 0 ? Math.round(totalMusicVolume / media.music.length) : 0,
    });
  }, [media.videos, media.music]);
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Statistiques des médias</h2>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">{stats.totalVideos}</div>
            <div className="text-sm text-blue-600 dark:text-blue-300">Vidéos au total</div>
            <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
              {stats.activeVideos} active{stats.activeVideos > 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">{stats.totalMusic}</div>
            <div className="text-sm text-purple-600 dark:text-purple-300">Musiques au total</div>
            <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
              {stats.activeMusic} active{stats.activeMusic > 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium mb-2">Vidéos</h3>
            
            {stats.totalVideos > 0 ? (
              <>
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">Volume moyen</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${stats.averageVideoVolume}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {stats.averageVideoVolume}%
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Formats</div>
                  <div className="space-y-1">
                    {Object.entries(stats.videoFormats).map(([format, count]) => (
                      <div key={format} className="flex justify-between items-center">
                        <div className="text-xs uppercase">{format}</div>
                        <div className="text-xs">
                          {count} ({Math.round(count / stats.totalVideos * 100)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Aucune vidéo n'a encore été ajoutée.
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Musique</h3>
            
            {stats.totalMusic > 0 ? (
              <>
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">Volume moyen</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${stats.averageMusicVolume}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {stats.averageMusicVolume}%
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Formats</div>
                  <div className="space-y-1">
                    {Object.entries(stats.musicFormats).map(([format, count]) => (
                      <div key={format} className="flex justify-between items-center">
                        <div className="text-xs uppercase">{format}</div>
                        <div className="text-xs">
                          {count} ({Math.round(count / stats.totalMusic * 100)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Aucune musique n'a encore été ajoutée.
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium mb-2">Paramètres globaux</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">Volume global vidéo</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${media.settings.globalVideoVolume}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {media.settings.globalVideoVolume}%
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-1">Volume global musique</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${media.settings.globalMusicVolume}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {media.settings.globalMusicVolume}%
              </div>
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className={`text-xs px-2 py-1 rounded ${media.settings.autoplayVideos ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
              Lecture auto vidéos: {media.settings.autoplayVideos ? 'Activée' : 'Désactivée'}
            </div>
            
            <div className={`text-xs px-2 py-1 rounded ${media.settings.muteAllVideos ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
              Son vidéos: {media.settings.muteAllVideos ? 'Désactivé' : 'Activé'}
            </div>
            
            <div className={`text-xs px-2 py-1 rounded ${media.settings.pauseVideosWhenHidden ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
              Pause vidéos hors vue: {media.settings.pauseVideosWhenHidden ? 'Activée' : 'Désactivée'}
            </div>
            
            <div className={`text-xs px-2 py-1 rounded ${media.settings.pauseMusicWhenHidden ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
              Pause musique hors vue: {media.settings.pauseMusicWhenHidden ? 'Activée' : 'Désactivée'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStatistics;
