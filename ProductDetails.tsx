import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface ProductDetailsProps {
  className?: string;
  onClose?: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  className = '',
  onClose
}) => {
  const { shop, actions } = useAppStore();
  const [quantity, setQuantity] = useState(1);
  
  // Si aucun produit n'est sélectionné, afficher un message
  if (!shop.selectedProduct) {
    return (
      <div className={`product-details ${className} p-4 text-center`}>
        <p>Aucun produit sélectionné</p>
        {onClose && (
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour aux produits
          </button>
        )}
      </div>
    );
  }
  
  const product = shop.selectedProduct;
  const discountedPrice = product.price * (1 - product.discount / 100);
  
  // Ajouter au panier
  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      actions.addToCart(product.id);
    }
    
    // Afficher un message de confirmation
    alert(`${product.name} ajouté au panier`);
    
    // Fermer les détails si nécessaire
    if (onClose) {
      onClose();
    }
  };
  
  // Mettre à jour la quantité
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  // Trouver la catégorie du produit
  const category = shop.categories.find(c => c.id === product.category);
  
  return (
    <div className={`product-details ${className} p-4`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div 
            className="h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {product.discount > 0 && (
              <div className="inline-block mt-4 ml-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                -{product.discount}%
              </div>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            {/* Miniatures supplémentaires (simulées) */}
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer"
                style={{
                  backgroundImage: `url(${product.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          
          {category && (
            <div className="text-sm text-gray-500 mb-4">
              Catégorie: {category.name}
            </div>
          )}
          
          <div className="mb-4">
            {product.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  {discountedPrice.toFixed(2)}€
                </span>
                <span className="text-lg text-gray-500 line-through ml-2">
                  {product.price.toFixed(2)}€
                </span>
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                  Économisez {(product.price - discountedPrice).toFixed(2)}€
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">
                {product.price.toFixed(2)}€
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              {product.description || "Aucune description disponible pour ce produit."}
            </p>
          </div>
          
          <div className="mb-4">
            <div className="text-sm font-medium mb-1">Quantité</div>
            <div className="flex items-center">
              <button
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-l disabled:opacity-50"
              >
                -
              </button>
              <div className="w-12 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                {quantity}
              </div>
              <button
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-r disabled:opacity-50"
              >
                +
              </button>
              
              <div className="ml-4 text-sm text-gray-500">
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 mb-6">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-2 rounded ${
                product.stock > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Ajouter au panier
            </button>
            
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Livraison gratuite à partir de 50€</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Retours gratuits sous 30 jours</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Garantie 2 ans</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Détails du produit</h2>
        
        <div className="border-t dark:border-gray-700">
          <div className="py-3 flex border-b dark:border-gray-700">
            <div className="w-1/3 font-medium">Référence</div>
            <div className="w-2/3">{product.id}</div>
          </div>
          
          <div className="py-3 flex border-b dark:border-gray-700">
            <div className="w-1/3 font-medium">Catégorie</div>
            <div className="w-2/3">{category ? category.name : 'Non catégorisé'}</div>
          </div>
          
          <div className="py-3 flex border-b dark:border-gray-700">
            <div className="w-1/3 font-medium">Disponibilité</div>
            <div className="w-2/3">
              {product.stock > 10 ? 'En stock' : product.stock > 0 ? 'Stock limité' : 'Rupture de stock'}
            </div>
          </div>
          
          <div className="py-3 flex border-b dark:border-gray-700">
            <div className="w-1/3 font-medium">Livraison</div>
            <div className="w-2/3">2-4 jours ouvrables</div>
          </div>
          
          <div className="py-3 flex">
            <div className="w-1/3 font-medium">Partager</div>
            <div className="w-2/3 flex space-x-2">
              <button className="p-1 rounded-full bg-blue-500 text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              
              <button className="p-1 rounded-full bg-blue-400 text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              
              <button className="p-1 rounded-full bg-red-500 text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.5 6.75h-1.513c-.96 0-1.15.435-1.15 1.072v1.428h2.287l-.3 2.313h-1.987v6.887h-2.4v-6.887H9.037V9.25h2.4V7.568c0-2.378 1.45-3.662 3.562-3.662 1.013 0 1.888.075 2.138.11v2.734z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {onClose && (
        <div className="mt-6 text-center">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Retour aux produits
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
