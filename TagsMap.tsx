import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface TagsMapProps {
  className?: string;
}

export const TagsMap: React.FC<TagsMapProps> = ({ className = '' }) => {
  const { tags, actions } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapData, setMapData] = React.useState<any>(null);
  
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
  
  // Redessiner la carte lorsque les tags changent
  useEffect(() => {
    if (mapData) {
      drawMap();
    }
  }, [tags.items, mapData]);
  
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
    
    // Dessiner les tags
    tags.items.forEach((tag) => {
      const pos = modelToCanvas(tag.position.x, tag.position.z);
      
      // Dessiner le cercle du tag
      ctx.fillStyle = tag.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Dessiner le contour
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Dessiner le libellé
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(tag.label, pos.x, pos.y + 20);
    });
  };
  
  // Gérer le clic sur la carte pour sélectionner un tag
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
    
    // Vérifier si un tag a été cliqué
    for (const tag of tags.items) {
      const tagPos = {
        x: offsetX + (tag.position.x - modelBounds.minX) * scale,
        y: offsetZ + (tag.position.z - modelBounds.minZ) * scale
      };
      
      const distance = Math.sqrt(Math.pow(x - tagPos.x, 2) + Math.pow(y - tagPos.y, 2));
      if (distance <= 8) {
        // Tag trouvé, le sélectionner
        actions.selectTag(tag.id);
        useAppStore.setState(state => {
          state.ui.tagsTab = 'edit';
        });
        return;
      }
    }
    
    // Aucun tag cliqué, créer un nouveau tag à cette position
    const modelPos = canvasToModel(x, y);
    
    try {
      // Obtenir le SDK Matterport
      const sdkManager = window.matterportSDK;
      if (!sdkManager) {
        console.error('SDK Matterport non disponible');
        return;
      }
      
      const showcase = sdkManager.getShowcase();
      
      // Générer un ID unique
      const id = `tag-${Date.now()}`;
      
      // Créer un nouveau tag
      const newTag = {
        id,
        label: 'Nouveau tag',
        description: 'Description du tag',
        position: { x: modelPos.x, y: 0, z: modelPos.z }, // Y est estimé à 0
        color: '#1E88E5',
      };
      
      // Ajouter le tag à Matterport
      showcase.Mattertag.add({
        label: newTag.label,
        description: newTag.description,
        anchorPosition: newTag.position,
        color: newTag.color,
      });
      
      // Ajouter le tag à l'état
      actions.addTag(newTag);
    } catch (error) {
      console.error('Erreur lors de la création du tag:', error);
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Carte des tags</h2>
      
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Cliquez sur la carte pour ajouter un tag ou sélectionnez un tag existant pour le modifier.
        </p>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleCanvasClick}
          className="w-full border border-gray-300 dark:border-gray-600 rounded"
        />
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {tags.items.length} tag(s) sur la carte
        </div>
      </div>
    </div>
  );
};

export default TagsMap;
