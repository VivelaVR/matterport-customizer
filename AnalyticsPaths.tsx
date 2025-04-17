import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface AnalyticsPathsProps {
  className?: string;
  pathType?: 'common' | 'optimal' | 'compare';
}

export const AnalyticsPaths: React.FC<AnalyticsPathsProps> = ({ 
  className = '', 
  pathType = 'common'
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [insights, setInsights] = useState<string[]>([]);
  
  // Initialiser la visualisation des chemins
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
    
    // Ajouter des étiquettes pour les pièces
    ctx.fillStyle = '#888888';
    ctx.font = '12px Arial';
    ctx.fillText('Entrée', 60, 70);
    ctx.fillText('Salon', 200, 100);
    ctx.fillText('Cuisine', 280, 200);
    ctx.fillText('Chambre', 100, 200);
    
    // Dessiner les chemins
    drawPaths(ctx, pathType);
    
    // Mettre à jour les insights
    updateInsights(pathType);
  }, [pathType]);
  
  // Dessiner les chemins sur le canvas
  const drawPaths = (ctx: CanvasRenderingContext2D, type: string) => {
    if (type === 'common') {
      // Chemin commun - de l'entrée au salon puis à la cuisine
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, 150);
      ctx.lineTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.lineTo(300, 200);
      ctx.stroke();
      
      // Chemin secondaire - de l'entrée à la chambre
      ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 150);
      ctx.lineTo(100, 200);
      ctx.stroke();
    } else if (type === 'optimal') {
      // Chemin optimal suggéré
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, 150);
      ctx.lineTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.lineTo(200, 200);
      ctx.lineTo(300, 200);
      ctx.stroke();
      
      // Flèches directionnelles
      drawArrow(ctx, 80, 125, 0, -Math.PI / 4);
      drawArrow(ctx, 150, 100, 0, 0);
      drawArrow(ctx, 200, 150, 0, Math.PI / 2);
      drawArrow(ctx, 250, 200, 0, 0);
    } else if (type === 'compare') {
      // Chemin réel des utilisateurs
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, 150);
      ctx.lineTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.lineTo(300, 200);
      ctx.stroke();
      
      // Chemin optimal suggéré
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(60, 150);
      ctx.lineTo(100, 100);
      ctx.lineTo(200, 100);
      ctx.lineTo(200, 200);
      ctx.lineTo(300, 200);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };
  
  // Dessiner une flèche directionnelle
  const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, direction: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(direction);
    
    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };
  
  // Mettre à jour les insights en fonction du type de chemin
  const updateInsights = (type: string) => {
    if (type === 'common') {
      setInsights([
        '90% des utilisateurs commencent par l\'entrée et se dirigent vers le salon.',
        '70% continuent ensuite vers la cuisine.',
        'Seulement 30% visitent la chambre après l\'entrée.'
      ]);
    } else if (type === 'optimal') {
      setInsights([
        'Le chemin optimal minimise les détours et offre une vue complète de l\'espace.',
        'Ce parcours permet de voir tous les points d\'intérêt en 2 minutes.',
        'Suivre ce chemin améliore l\'engagement de 25% selon nos analyses.'
      ]);
    } else if (type === 'compare') {
      setInsights([
        'Les utilisateurs prennent un raccourci qui leur fait manquer 30% des points d\'intérêt.',
        'Le chemin optimal est 15% plus long mais offre une expérience plus complète.',
        'Recommandation: ajouter des points d\'intérêt pour guider vers le chemin optimal.'
      ]);
    }
  };
  
  return (
    <div className={`analytics-paths ${className}`}>
      <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {pathType === 'common' && 'Visualisation des chemins les plus empruntés par les utilisateurs.'}
        {pathType === 'optimal' && 'Chemin optimal suggéré pour une meilleure expérience utilisateur.'}
        {pathType === 'compare' && 'Comparaison entre les chemins réels et le chemin optimal suggéré.'}
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full border border-gray-300 dark:border-gray-600 rounded"
      />
      
      <div className="mt-3 flex justify-center">
        {pathType === 'common' && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-2 bg-red-500 mr-1"></div>
              <div className="text-xs">Chemin principal</div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-2 bg-blue-500 mr-1"></div>
              <div className="text-xs">Chemin secondaire</div>
            </div>
          </div>
        )}
        {pathType === 'optimal' && (
          <div className="flex items-center">
            <div className="w-4 h-2 bg-green-500 mr-1"></div>
            <div className="text-xs">Chemin optimal suggéré</div>
          </div>
        )}
        {pathType === 'compare' && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-2 bg-red-500 mr-1"></div>
              <div className="text-xs">Chemin réel</div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-2 bg-green-500 mr-1 border-t border-b border-dashed"></div>
              <div className="text-xs">Chemin optimal</div>
            </div>
          </div>
        )}
      </div>
      
      {insights.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Analyse des chemins</h3>
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

export default AnalyticsPaths;
