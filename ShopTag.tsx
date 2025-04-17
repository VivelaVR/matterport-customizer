import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface ShopTagProps {
  className?: string;
  position?: { x: number; y: number; z: number };
  productId: string;
}

export const ShopTag: React.FC<ShopTagProps> = ({ 
  className = '',
  position,
  productId
}) => {
  const { shop, actions } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Trouver le produit correspondant
  const product = shop.products.find(p => p.id === productId);
  
  if (!product) {
    return null;
  }
  
  // Calculer le prix avec réduction
  const discountedPrice = product.price * (1 - product.discount / 100);
  
  // Ajouter au panier
  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.addToCart(productId);
    
    // Afficher un message de confirmation
    alert(`${product.name} ajouté au panier`);
  };
  
  // Afficher les détails du produit
  const showDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.setSelectedProduct(product);
    useAppStore.setState(state => {
      state.ui.shopTab = 'product_details';
    });
  };
  
  return (
    <div 
      className={`shop-tag ${className} absolute`}
      style={position ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: Math.floor(position.z)
      } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`
        w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer
        transition-transform ${isHovered || isExpanded ? 'scale-110' : 'scale-100'}
      `}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      
      {(isHovered || isExpanded) && (
        <div className="absolute left-full ml-2 top-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
          <div 
            className="h-32 bg-gray-200 dark:bg-gray-700 cursor-pointer"
            onClick={showDetails}
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {product.discount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{product.discount}%
              </div>
            )}
          </div>
          
          <div className="p-3">
            <h3 
              className="font-medium text-sm mb-1 cursor-pointer hover:text-blue-500"
              onClick={showDetails}
            >
              {product.name}
            </h3>
            
            <div className="flex justify-between items-center mb-2">
              <div>
                {product.discount > 0 ? (
                  <div className="flex items-center">
                    <span className="text-lg font-bold">
                      {discountedPrice.toFixed(2)}€
                    </span>
                    <span className="text-xs text-gray-500 line-through ml-1">
                      {product.price.toFixed(2)}€
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">
                    {product.price.toFixed(2)}€
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-1 rounded text-sm ${
                  product.stock > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Ajouter au panier
              </button>
              
              <button
                onClick={showDetails}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopTag;
