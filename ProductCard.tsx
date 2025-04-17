import React from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    stock: number;
    imageUrl: string;
    description: string;
    category: string;
    popularity: number;
  };
  onShowDetails?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  onShowDetails
}) => {
  const { actions } = useAppStore();
  
  // Ajouter un produit au panier
  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.addToCart(product.id);
  };
  
  // Afficher les détails du produit
  const showDetails = () => {
    if (onShowDetails) {
      onShowDetails(product.id);
    } else {
      actions.setSelectedProduct(product);
      useAppStore.setState(state => {
        state.ui.shopTab = 'product_details';
      });
    }
  };
  
  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700"
    >
      <div
        className="h-40 bg-gray-200 dark:bg-gray-700 relative cursor-pointer"
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
                  {(product.price * (1 - product.discount / 100)).toFixed(2)}€
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
        
        <button
          onClick={addToCart}
          disabled={product.stock === 0}
          className={`w-full py-1 rounded text-sm ${
            product.stock > 0
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
