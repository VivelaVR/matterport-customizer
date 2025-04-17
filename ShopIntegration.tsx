import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface ShopIntegrationProps {
  className?: string;
}

export const ShopIntegration: React.FC<ShopIntegrationProps> = ({ 
  className = ''
}) => {
  const { shop, actions } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filtrer les produits par catégorie
  const filteredProducts = shop.products
    .filter(product => 
      selectedCategory === 'all' || product.category === selectedCategory
    )
    .slice(0, 6); // Limiter à 6 produits pour l'affichage intégré
  
  // Ajouter un produit au panier
  const addToCart = (productId: string) => {
    actions.addToCart(productId);
    
    // Afficher un message de confirmation
    alert(`Produit ajouté au panier`);
  };
  
  // Afficher les détails d'un produit
  const showProductDetails = (productId: string) => {
    const product = shop.products.find(p => p.id === productId);
    if (product) {
      actions.setSelectedProduct(product);
      useAppStore.setState(state => {
        state.ui.shopTab = 'product_details';
      });
    }
  };
  
  return (
    <div className={`shop-integration ${className} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4`}>
      <h2 className="text-lg font-medium mb-4">Produits disponibles</h2>
      
      <div className="flex overflow-x-auto mb-4 pb-2">
        <button
          className={`px-3 py-1 mr-2 whitespace-nowrap rounded ${
            selectedCategory === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          Tous
        </button>
        
        {shop.categories.map(category => (
          <button
            key={category.id}
            className={`px-3 py-1 mr-2 whitespace-nowrap rounded ${
              selectedCategory === category.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map(product => {
          const discountedPrice = product.price * (1 - product.discount / 100);
          
          return (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700"
            >
              <div
                className="h-24 bg-gray-200 dark:bg-gray-700 relative cursor-pointer"
                onClick={() => showProductDetails(product.id)}
                style={{
                  backgroundImage: `url(${product.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {product.discount > 0 && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                    -{product.discount}%
                  </div>
                )}
              </div>
              
              <div className="p-2">
                <h3 
                  className="font-medium text-xs mb-1 cursor-pointer hover:text-blue-500 truncate"
                  onClick={() => showProductDetails(product.id)}
                >
                  {product.name}
                </h3>
                
                <div className="flex justify-between items-center">
                  <div>
                    {product.discount > 0 ? (
                      <div className="flex items-center">
                        <span className="text-sm font-bold">
                          {discountedPrice.toFixed(2)}€
                        </span>
                        <span className="text-xs text-gray-500 line-through ml-1">
                          {product.price.toFixed(2)}€
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold">
                        {product.price.toFixed(2)}€
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    className={`p-1 rounded ${
                      product.stock > 0
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Aucun produit trouvé dans cette catégorie.
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            useAppStore.setState(state => {
              state.ui.shopTab = 'products';
            });
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Voir tous les produits
        </button>
      </div>
      
      {shop.cart.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">{shop.cart.length}</span> produit(s) dans le panier
            </div>
            <button
              onClick={() => {
                useAppStore.setState(state => {
                  state.ui.shopTab = 'cart';
                });
              }}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Voir le panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopIntegration;
