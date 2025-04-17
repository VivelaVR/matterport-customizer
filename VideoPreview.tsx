import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import VideoPlayer from '@/components/media/VideoPlayer';

interface VideoPreviewProps {
  className?: string;
  videoId?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  className = '', 
  videoId 
}) => {
  const { media } = useAppStore();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  // Récupérer la vidéo sélectionnée lorsque l'ID change
  useEffect(() => {
    if (!videoId) {
      setSelectedVideo(null);
      return;
    }
    
    const video = media.videos.find(v => v.id === videoId);
    setSelectedVideo(video || null);
  }, [videoId, media.videos]);
  
  return (
    <div className={`video-preview ${className}`}>
      {selectedVideo ? (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{selectedVideo.title}</h3>
          
          <div className="aspect-video bg-black rounded overflow-hidden">
            <VideoPlayer
              videoUrl={selectedVideo.url}
              autoplay={selectedVideo.autoplay}
              loop={selectedVideo.loop}
              muted={selectedVideo.muted}
              controls={true}
              onError={(error) => console.error('Erreur de lecture vidéo:', error)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-medium">Position</div>
              <div className="text-gray-600 dark:text-gray-400">
                X: {selectedVideo.position.x.toFixed(2)}<br />
                Y: {selectedVideo.position.y.toFixed(2)}<br />
                Z: {selectedVideo.position.z.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="font-medium">Rotation</div>
              <div className="text-gray-600 dark:text-gray-400">
                X: {selectedVideo.rotation.x}°<br />
                Y: {selectedVideo.rotation.y}°<br />
                Z: {selectedVideo.rotation.z}°
              </div>
            </div>
          </div>
          
          <div className="text-sm">
            <div className="font-medium">Échelle</div>
            <div className="text-gray-600 dark:text-gray-400">
              X: {selectedVideo.scale.x} / Y: {selectedVideo.scale.y} / Z: {selectedVideo.scale.z}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedVideo.autoplay && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                Lecture auto
              </span>
            )}
            {selectedVideo.loop && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                Boucle
              </span>
            )}
            {selectedVideo.muted && (
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                Muet
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="text-gray-500 dark:text-gray-400">
            Aucune vidéo sélectionnée
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
