import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface Object3DPreviewProps {
  className?: string;
  modelUrl?: string;
}

export const Object3DPreview: React.FC<Object3DPreviewProps> = ({ className = '', modelUrl }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !modelUrl) return;
    
    // Initialiser Three.js
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    const scene = new THREE.Scene();
    
    // Ajouter une lumière ambiante
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Ajouter des lumières directionnelles
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, 0.5, -1);
    scene.add(directionalLight2);
    
    // Configurer la caméra
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    
    // Charger le modèle 3D
    setLoading(true);
    setError(null);
    
    const loader = new GLTFLoader();
    
    try {
      loader.load(
        modelUrl,
        (gltf) => {
          // Réinitialiser la scène
          while(scene.children.length > 0) { 
            scene.remove(scene.children[0]); 
          }
          
          // Ajouter les lumières
          scene.add(ambientLight);
          scene.add(directionalLight1);
          scene.add(directionalLight2);
          
          // Ajouter le modèle à la scène
          const model = gltf.scene;
          
          // Calculer la boîte englobante pour centrer et dimensionner le modèle
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          // Centrer le modèle
          model.position.x = -center.x;
          model.position.y = -center.y;
          model.position.z = -center.z;
          
          // Ajuster l'échelle pour que le modèle soit bien visible
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 2 / maxDim;
            model.scale.set(scale, scale, scale);
          }
          
          scene.add(model);
          
          // Animation de rotation
          let animationId: number;
          const animate = () => {
            animationId = requestAnimationFrame(animate);
            model.rotation.y += 0.01;
            renderer.render(scene, camera);
          };
          animate();
          
          setLoading(false);
          
          // Nettoyer l'animation lors du démontage
          return () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
          };
        },
        (progress) => {
          // Progression du chargement
          console.log(`Chargement du modèle: ${Math.round(progress.loaded / progress.total * 100)}%`);
        },
        (error) => {
          console.error('Erreur lors du chargement du modèle:', error);
          setError(`Erreur lors du chargement du modèle: ${error.message}`);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du chargeur:', err);
      setError(`Erreur lors de l'initialisation du chargeur: ${err}`);
      setLoading(false);
    }
    
    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Nettoyer lors du démontage
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [modelUrl]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded bg-gray-100 dark:bg-gray-700"
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
          <div className="text-white">Chargement du modèle...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30 rounded">
          <div className="text-white text-center p-4">{error}</div>
        </div>
      )}
      
      {!modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded">
          <div className="text-gray-500 dark:text-gray-400">Aucun modèle sélectionné</div>
        </div>
      )}
    </div>
  );
};

export default Object3DPreview;
