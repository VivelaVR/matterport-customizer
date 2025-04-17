import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

interface CheckoutFormProps {
  className?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  className = '',
  onComplete,
  onCancel
}) => {
  const { shop, actions } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Adresse de livraison
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    
    // Informations de paiement
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Options de livraison
    shippingMethod: 'standard',
    
    // Conditions
    acceptTerms: false
  });
  
  // Calculer le total du panier
  const cartTotal = shop.cart.reduce((total, item) => {
    const product = shop.products.find(p => p.id === item.productId);
    if (product) {
      const discountedPrice = product.price * (1 - product.discount / 100);
      return total + discountedPrice * item.quantity;
    }
    return total;
  }, 0);
  
  // Calculer les frais de livraison
  const getShippingCost = () => {
    if (formData.shippingMethod === 'express') {
      return 9.99;
    } else if (formData.shippingMethod === 'standard') {
      return cartTotal >= 50 ? 0 : 4.99;
    }
    return 0;
  };
  
  // Calculer le total avec la réduction du coupon
  const discountedTotal = shop.couponApplied
    ? cartTotal * (1 - shop.couponDiscount / 100)
    : cartTotal;
  
  // Calculer le total final
  const finalTotal = discountedTotal + getShippingCost();
  
  // Mettre à jour les données du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Passer à l'étape suivante
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  // Revenir à l'étape précédente
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Soumettre la commande
  const submitOrder = () => {
    // Simuler la soumission de la commande
    console.log('Commande soumise:', {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      shipping: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        method: formData.shippingMethod
      },
      payment: {
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        expiryDate: formData.expiryDate
      },
      order: {
        items: shop.cart,
        subtotal: cartTotal,
        discount: shop.couponApplied ? (cartTotal * shop.couponDiscount / 100) : 0,
        shipping: getShippingCost(),
        total: finalTotal
      }
    });
    
    // Vider le panier
    actions.clearCart();
    
    // Passer à l'étape de confirmation
    setStep(4);
    
    // Appeler le callback de complétion si fourni
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <div className={`checkout-form ${className}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`flex items-center ${i < step ? 'text-green-500' : i === step ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  i < step 
                    ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300' 
                    : i === step 
                      ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                }`}
              >
                {i < step ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i
                )}
              </div>
              <span className="text-sm hidden md:inline">
                {i === 1 ? 'Informations' : i === 2 ? 'Livraison' : 'Paiement'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="relative mt-2">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="step-1">
          <h2 className="text-lg font-medium mb-4">Informations personnelles</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Retour au panier
            </button>
            
            <button
              onClick={nextStep}
              disabled={!formData.firstName || !formData.lastName || !formData.email}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="step-2">
          <h2 className="text-lg font-medium mb-4">Adresse de livraison</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Code postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Pays <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Méthode de livraison <span className="text-red-500">*</span>
              </label>
              
              <div className="space-y-2 mt-2">
                <div className="flex items-center p-3 border rounded dark:border-gray-600">
                  <input
                    type="radio"
                    id="shipping-standard"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="shipping-standard" className="flex-1">
                    <div className="font-medium">Livraison standard</div>
                    <div className="text-sm text-gray-500">2-4 jours ouvrables</div>
                  </label>
                  <div className="font-medium">
                    {cartTotal >= 50 ? 'Gratuit' : '4,99€'}
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded dark:border-gray-600">
                  <input
                    type="radio"
                    id="shipping-express"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="shipping-express" className="flex-1">
                    <div className="font-medium">Livraison express</div>
                    <div className="text-sm text-gray-500">1-2 jours ouvrables</div>
                  </label>
                  <div className="font-medium">9,99€</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Retour
            </button>
            
            <button
              onClick={nextStep}
              disabled={!formData.address || !formData.city || !formData.postalCode || !formData.country}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="step-3">
          <h2 className="text-lg font-medium mb-4">Paiement</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Numéro de carte <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom sur la carte <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date d'expiration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            </div>
        
(Content truncated due to size limit. Use line ranges to read in chunks)