import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface VideoPlayerProps {
  className?: string;
  videoUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onError?: (error: Error) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  className = '', 
  videoUrl,
  autoplay = false,
  loop = true,
  muted = false,
  controls = true,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Initialiser la vidéo lorsque l'URL change
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;
    
    const video = videoRef.current;
    
    // Réinitialiser l'état
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    
    // Configurer la vidéo
    video.src = videoUrl;
    video.autoplay = autoplay;
    video.loop = loop;
    video.muted = muted;
    video.volume = volume / 100;
    
    // Charger la vidéo
    video.load();
    
    if (autoplay) {
      video.play().catch(err => {
        console.error('Erreur lors de la lecture automatique de la vidéo:', err);
        setIsPlaying(false);
        setError('La lecture automatique a été bloquée par le navigateur.');
        if (onError) onError(err);
      });
    }
  }, [videoUrl, autoplay, loop, muted, volume, onError]);
  
  // Gérer les événements de la vidéo
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
      }
    };
    
    const handleError = () => {
      const errorMessage = 'Erreur lors du chargement de la vidéo.';
      setError(errorMessage);
      if (onError) onError(new Error(errorMessage));
    };
    
    // Ajouter les écouteurs d'événements
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    
    // Nettoyer les écouteurs d'événements lors du démontage
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [loop, onError]);
  
  // Mettre à jour le volume lorsqu'il change
  useEffect(() => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = volume / 100;
  }, [volume]);
  
  // Mettre à jour l'état muet lorsqu'il change
  useEffect(() => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = isMuted;
  }, [isMuted]);
  
  // Formater le temps (secondes -> MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Gérer la lecture/pause
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error('Erreur lors de la lecture de la vidéo:', err);
        setError('La lecture a été bloquée par le navigateur.');
        if (onError) onError(err);
      });
    }
  };
  
  // Gérer le changement de position dans la vidéo
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Gérer le changement de volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };
  
  // Gérer le changement d'état muet
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  return (
    <div className={`video-player ${className}`}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30 rounded z-10">
          <div className="text-white text-center p-4">{error}</div>
        </div>
      )}
      
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-auto rounded"
          playsInline
          onClick={handlePlayPause}
        >
          {videoUrl && <source src={videoUrl} />}
          Votre navigateur ne prend pas en charge la lecture de vidéos.
        </video>
        
        {controls && (
          <div className="video-controls absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 rounded-b">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-blue-300 transition-colors"
                title={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              <input
                type="range"
                value={currentTime}
                min={0}
                max={duration || 100}
                step={0.1}
                onChange={handleSeek}
                className="flex-grow"
              />
              
              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-blue-300 transition-colors"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              
              <input
                type="range"
                value={volume}
                min={0}
                max={100}
                step={1}
                onChange={handleVolumeChange}
                className="w-20"
                title={`Volume: ${volume}%`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
