import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface AnalyticsHeatmapProps {
  className?: string;
  heatmapType?: 'dwell' | 'clicks' | 'views';
}

export const AnalyticsHeatmap: React.FC<AnalyticsHeatmapProps> = ({ 
  className = '', 
  heatmapType = 'dwell'
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [insights, setInsights] = useState<string[]>([]);
  
  // Initialiser la carte de chaleur
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner le plan du modèle (simplifié)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les murs (simplifié)
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    
    // Dessiner quelques murs pour simuler un plan
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(350, 50);
    ctx.lineTo(350, 250);
    ctx.lineTo(250, 250);
    ctx.lineTo(250, 150);
    ctx.lineTo(150, 150);
    ctx.lineTo(150, 250);
    ctx.lineTo(50, 250);
    ctx.closePath();
    ctx.stroke();
    
    // Dessiner la carte de chaleur
    const heatmapData = generateHeatmapData(heatmapType);
    drawHeatmap(ctx, heatmapData);
    
    // Mettre à jour les insights
    updateInsights(heatmapType);
  }, [heatmapType]);
  
  // Générer des données de carte de chaleur simulées
  const generateHeatmapData = (type: string) => {
    const data = [];
    const pointCount = 50;
    
    // Différentes distributions selon le type de carte de chaleur
    if (type === 'dwell') {
      // Temps passé - concentré dans certaines zones
      for (let i = 0; i < pointCount; i++) {
        const x = 100 + Math.random() * 200;
        const y = 100 + Math.random() * 100;
        const intensity = Math.random() * 0.8 + 0.2;
        data.push({ x, y, intensity });
      }
    } else if (type === 'clicks') {
      // Clics - plus dispersés
      for (let i = 0; i < pointCount; i++) {
        const x = 50 + Math.random() * 300;
        const y = 50 + Math.random() * 200;
        const intensity = Math.random() * 0.6 + 0.4;
        data.push({ x, y, intensity });
      }
    } else if (type === 'views') {
      // Vues - concentrées sur les bords
      for (let i = 0; i < pointCount; i++) {
        let x, y;
        if (Math.random() > 0.5) {
          x = 50 + Math.random() * 300;
          y = Math.random() > 0.5 ? 50 + Math.random() * 30 : 220 + Math.random() * 30;
        } else {
          x = Math.random() > 0.5 ? 50 + Math.random() * 30 : 320 + Math.random() * 30;
          y = 50 + Math.random() * 200;
        }
        const intensity = Math.random() * 0.7 + 0.3;
        data.push({ x, y, intensity });
      }
    }
    
    return data;
  };
  
  // Dessiner la carte de chaleur sur le canvas
  const drawHeatmap = (ctx: CanvasRenderingContext2D, data: any[]) => {
    data.forEach(point => {
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, 30
      );
      
      let color;
      if (heatmapType === 'dwell') {
        color = 'rgba(255, 0, 0, ';
      } else if (heatmapType === 'clicks') {
        color = 'rgba(0, 0, 255, ';
      } else {
        color = 'rgba(0, 255, 0, ';
      }
      
      gradient.addColorStop(0, color + point.intensity + ')');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 30, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  // Mettre à jour les insights en fonction du type de carte de chaleur
  const updateInsights = (type: string) => {
    if (type === 'dwell') {
      setInsights([
        'Les utilisateurs passent le plus de temps dans la zone du salon.',
        'La cuisine est la deuxième zone la plus visitée.',
        'Les couloirs sont traversés rapidement sans s'y attarder.'
      ]);
    } else if (type === 'clicks') {
      setInsights([
        'Les tags d'information produit reçoivent le plus de clics.',
        'Les utilisateurs interagissent souvent avec les objets dans la cuisine.',
        'Peu d'interactions sont enregistrées dans les zones de passage.'
      ]);
    } else if (type === 'views') {
      setInsights([
        'Les utilisateurs regardent principalement les meubles et les décorations.',
        'Les fenêtres et les vues extérieures attirent beaucoup l'attention.',
        'Les plafonds et les sols sont rarement regardés en détail.'
      ]);
    }
  };
  
  return (
    <div className={`analytics-heatmap ${className}`}>
      <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {heatmapType === 'dwell' && 'Cette carte montre les zones où les utilisateurs passent le plus de temps.'}
        {heatmapType === 'clicks' && 'Cette carte montre les zones où les utilisateurs cliquent le plus souvent.'}
        {heatmapType === 'views' && 'Cette carte montre les zones que les utilisateurs regardent le plus souvent.'}
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full border border-gray-300 dark:border-gray-600 rounded"
      />
      
      <div className="mt-3 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-200"></div>
          <div className="text-xs">Faible</div>
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <div className="text-xs">Moyen</div>
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="text-xs">Élevé</div>
        </div>
      </div>
      
      {insights.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Insights</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-400">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalyticsHeatmap;
