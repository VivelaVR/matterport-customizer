import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface Object3DPositionerProps {
  className?: string;
  onPositionSelected?: (position: { x: number; y: number; z: number }) => void;
}

export const Object3DPositioner: React.FC<Object3DPositionerProps> = ({ 
  className = '', 
  onPositionSelected 
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  
  // Initialiser la carte
  useEffect(() => {
    const initMap = async () => {
      try {
        // Obtenir le SDK Matterport
        const sdkManager = window.matterportSDK;
        if (!sdkManager) {
          console.error('SDK Matterport non disponible');
          return;
        }
        
        const showcase = sdkManager.getShowcase();
        
        // Obtenir les données du modèle
        const modelData = await showcase.Model.getData();
        setMapData(modelData);
        
        // Dessiner la carte
        drawMap();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
      }
    };
    
    initMap();
  }, []);
  
  // Redessiner la carte lorsque la position sélectionnée change
  useEffect(() => {
    if (mapData) {
      drawMap();
    }
  }, [selectedPosition, mapData]);
  
  // Fonction pour dessiner la carte
  const drawMap = () => {
    if (!canvasRef.current || !mapData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner le plan du modèle (simplifié)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculer l'échelle et le décalage pour adapter le modèle au canvas
    const modelBounds = mapData.sweeps.reduce((bounds: any, sweep: any) => {
      bounds.minX = Math.min(bounds.minX, sweep.position.x);
      bounds.maxX = Math.max(bounds.maxX, sweep.position.x);
      bounds.minZ = Math.min(bounds.minZ, sweep.position.z);
      bounds.maxZ = Math.max(bounds.maxZ, sweep.position.z);
      return bounds;
    }, { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
    
    const modelWidth = modelBounds.maxX - modelBounds.minX;
    const modelHeight = modelBounds.maxZ - modelBounds.minZ;
    const padding = 20;
    
    const scaleX = (canvas.width - padding * 2) / modelWidth;
    const scaleZ = (canvas.height - padding * 2) / modelHeight;
    const scale = Math.min(scaleX, scaleZ);
    
    const offsetX = padding + (canvas.width - padding * 2 - modelWidth * scale) / 2;
    const offsetZ = padding + (canvas.height - padding * 2 - modelHeight * scale) / 2;
    
    // Fonction pour convertir les coordonnées du modèle en coordonnées du canvas
    const modelToCanvas = (x: number, z: number) => {
      return {
        x: offsetX + (x - modelBounds.minX) * scale,
        y: offsetZ + (z - modelBounds.minZ) * scale
      };
    };
    
    // Dessiner les points de balayage (sweeps)
    ctx.fillStyle = '#cccccc';
    mapData.sweeps.forEach((sweep: any) => {
      const pos = modelToCanvas(sweep.position.x, sweep.position.z);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Dessiner les murs (simplifié)
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    if (mapData.walls) {
      mapData.walls.forEach((wall: any) => {
        const start = modelToCanvas(wall.start.x, wall.start.z);
        const end = modelToCanvas(wall.end.x, wall.end.z);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });
    }
    
    // Dessiner la position sélectionnée
    if (selectedPosition) {
      const pos = modelToCanvas(selectedPosition.x, selectedPosition.z);
      
      // Dessiner le cercle de la position
      ctx.fillStyle = '#FF5722';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Dessiner le contour
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Dessiner une croix au centre
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pos.x - 4, pos.y);
      ctx.lineTo(pos.x + 4, pos.y);
      ctx.moveTo(pos.x, pos.y - 4);
      ctx.lineTo(pos.x, pos.y + 4);
      ctx.stroke();
    }
  };
  
  // Gérer le clic sur la carte pour sélectionner une position
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !mapData) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculer l'échelle et le décalage (comme dans drawMap)
    const modelBounds = mapData.sweeps.reduce((bounds: any, sweep: any) => {
      bounds.minX = Math.min(bounds.minX, sweep.position.x);
      bounds.maxX = Math.max(bounds.maxX, sweep.position.x);
      bounds.minZ = Math.min(bounds.minZ, sweep.position.z);
      bounds.maxZ = Math.max(bounds.maxZ, sweep.position.z);
      return bounds;
    }, { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
    
    const modelWidth = modelBounds.maxX - modelBounds.minX;
    const modelHeight = modelBounds.maxZ - modelBounds.minZ;
    const padding = 20;
    
    const scaleX = (canvas.width - padding * 2) / modelWidth;
    const scaleZ = (canvas.height - padding * 2) / modelHeight;
    const scale = Math.min(scaleX, scaleZ);
    
    const offsetX = padding + (canvas.width - padding * 2 - modelWidth * scale) / 2;
    const offsetZ = padding + (canvas.height - padding * 2 - modelHeight * scale) / 2;
    
    // Fonction pour convertir les coordonnées du canvas en coordonnées du modèle
    const canvasToModel = (canvasX: number, canvasY: number) => {
      return {
        x: modelBounds.minX + (canvasX - offsetX) / scale,
        z: modelBounds.minZ + (canvasY - offsetZ) / scale
      };
    };
    
    // Convertir les coordonnées du clic en coordonnées du modèle
    const modelPos = canvasToModel(x, y);
    
    // Mettre à jour la position sélectionnée
    const newPosition = { x: modelPos.x, y: 0, z: modelPos.z };
    setSelectedPosition(newPosition);
    
    // Appeler le callback si fourni
    if (onPositionSelected) {
      onPositionSelected(newPosition);
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Positionner l'objet 3D</h2>
      
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Cliquez sur la carte pour choisir la position de l'objet 3D.
        </p>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleCanvasClick}
          className="w-full border border-gray-300 dark:border-gray-600 rounded"
        />
        
        {selectedPosition && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Position sélectionnée: X: {selectedPosition.x.toFixed(2)}, Z: {selectedPosition.z.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Object3DPositioner;
