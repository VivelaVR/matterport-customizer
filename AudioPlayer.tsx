import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface AudioPlayerProps {
  className?: string;
  audioUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
  controls?: boolean;
  onError?: (error: Error) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  className = '', 
  audioUrl,
  autoplay = false,
  loop = true,
  volume = 50,
  controls = true,
  onError
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Initialiser l'audio lorsque l'URL change
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    
    const audio = audioRef.current;
    
    // Réinitialiser l'état
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    
    // Configurer l'audio
    audio.src = audioUrl;
    audio.autoplay = autoplay;
    audio.loop = loop;
    audio.volume = currentVolume / 100;
    
    // Charger l'audio
    audio.load();
    
    if (autoplay) {
      audio.play().catch(err => {
        console.error('Erreur lors de la lecture automatique de l\'audio:', err);
        setIsPlaying(false);
        setError('La lecture automatique a été bloquée par le navigateur.');
        if (onError) onError(err);
      });
    }
  }, [audioUrl, autoplay, loop, currentVolume, onError]);
  
  // Gérer les événements de l'audio
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
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
      const errorMessage = 'Erreur lors du chargement de l\'audio.';
      setError(errorMessage);
      if (onError) onError(new Error(errorMessage));
    };
    
    // Ajouter les écouteurs d'événements
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Nettoyer les écouteurs d'événements lors du démontage
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [loop, onError]);
  
  // Mettre à jour le volume lorsqu'il change
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = currentVolume / 100;
  }, [currentVolume]);
  
  // Mettre à jour l'état muet lorsqu'il change
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = isMuted;
  }, [isMuted]);
  
  // Formater le temps (secondes -> MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Gérer la lecture/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Erreur lors de la lecture de l\'audio:', err);
        setError('La lecture a été bloquée par le navigateur.');
        if (onError) onError(err);
      });
    }
  };
  
  // Gérer le changement de position dans l'audio
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Gérer le changement de volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setCurrentVolume(newVolume);
  };
  
  // Gérer le changement d'état muet
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  return (
    <div className={`audio-player ${className}`}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
          {error}
        </div>
      )}
      
      <audio
        ref={audioRef}
        className="hidden"
      >
        {audioUrl && <source src={audioUrl} />}
        Votre navigateur ne prend pas en charge la lecture audio.
      </audio>
      
      {controls && (
        <div className="audio-controls bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={handlePlayPause}
              className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              title={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <div className="text-gray-800 dark:text-white text-xs">
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
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMuteToggle}
              className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            
            <input
              type="range"
              value={currentVolume}
              min={0}
              max={100}
              step={1}
              onChange={handleVolumeChange}
              className="flex-grow"
              title={`Volume: ${currentVolume}%`}
            />
            
            <div className="text-gray-800 dark:text-white text-xs">
              {currentVolume}%
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
            {audioUrl ? audioUrl.split('/').pop() : 'Aucun fichier audio sélectionné'}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
