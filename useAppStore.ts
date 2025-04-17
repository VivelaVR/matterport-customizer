import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MatterportConfig, defaultConfig, mergeConfig } from '../lib/matterport/config';

// Interface pour l'état de l'application
interface AppState {
  // Configuration Matterport
  matterportConfig: MatterportConfig;
  
  // État de l'interface
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    currentView: string;
    loading: boolean;
    interfaceTab: 'basic' | 'advanced' | 'preview';
  };
  
  // État des tags
  tags: {
    items: Tag[];
    selectedTagId: string | null;
  };
  
  // État des objets 3D
  objects3D: {
    items: Object3D[];
    selectedObjectId: string | null;
  };
  
  // État des médias
  media: {
    videos: Video[];
    audioTracks: AudioTrack[];
    currentAudioTrack: string | null;
    audioVolume: number;
    audioMuted: boolean;
  };
  
  // État de la navigation guidée
  guidedNavigation: {
    routes: Route[];
    currentRouteId: string | null;
    isPlaying: boolean;
    currentStepIndex: number;
  };
  
  // État de la boutique
  shop: {
    products: Product[];
    cart: CartItem[];
    categories: Category[];
    selectedCategoryId: string | null;
  };
  
  // Actions
  actions: {
    // Configuration
    updateMatterportConfig: (config: Partial<MatterportConfig>) => void;
    
    // UI
    setTheme: (theme: 'light' | 'dark') => void;
    toggleSidebar: () => void;
    setCurrentView: (view: string) => void;
    setLoading: (loading: boolean) => void;
    setInterfaceTab: (tab: 'basic' | 'advanced' | 'preview') => void;
    
    // Tags
    addTag: (tag: Tag) => void;
    updateTag: (id: string, data: Partial<Tag>) => void;
    removeTag: (id: string) => void;
    selectTag: (id: string | null) => void;
    
    // Objets 3D
    addObject3D: (object: Object3D) => void;
    updateObject3D: (id: string, data: Partial<Object3D>) => void;
    removeObject3D: (id: string) => void;
    selectObject3D: (id: string | null) => void;
    
    // Médias
    addVideo: (video: Video) => void;
    removeVideo: (id: string) => void;
    addAudioTrack: (track: AudioTrack) => void;
    removeAudioTrack: (id: string) => void;
    setCurrentAudioTrack: (id: string | null) => void;
    setAudioVolume: (volume: number) => void;
    toggleAudioMuted: () => void;
    
    // Navigation guidée
    addRoute: (route: Route) => void;
    updateRoute: (id: string, data: Partial<Route>) => void;
    removeRoute: (id: string) => void;
    startGuidedNavigation: (routeId: string) => void;
    stopGuidedNavigation: () => void;
    nextStep: () => void;
    previousStep: () => void;
    
    // Boutique
    addProduct: (product: Product) => void;
    updateProduct: (id: string, data: Partial<Product>) => void;
    removeProduct: (id: string) => void;
    addToCart: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartItemQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    selectCategory: (id: string | null) => void;
  };
}

// Types pour les entités
interface Tag {
  id: string;
  label: string;
  description: string;
  position: { x: number; y: number; z: number };
  color: string;
  iconUrl?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  link?: string;
}

interface Object3D {
  id: string;
  name: string;
  modelUrl: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  visible: boolean;
}

interface Video {
  id: string;
  name: string;
  url: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  autoplay: boolean;
  loop: boolean;
}

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  loop: boolean;
  triggerZones?: {
    position: { x: number; y: number; z: number };
    radius: number;
  }[];
}

interface RouteStep {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  duration: number;
  description?: string;
}

interface Route {
  id: string;
  name: string;
  description: string;
  steps: RouteStep[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  position?: { x: number; y: number; z: number };
  modelUrl?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

// Création du store
export const useAppStore = create<AppState>()(
  immer((set) => ({
    // État initial
    matterportConfig: defaultConfig,
    
    ui: {
      theme: 'light',
      sidebarOpen: true,
      currentView: 'home',
      loading: false,
      interfaceTab: 'basic',
    },
    
    tags: {
      items: [],
      selectedTagId: null,
    },
    
    objects3D: {
      items: [],
      selectedObjectId: null,
    },
    
    media: {
      videos: [],
      audioTracks: [],
      currentAudioTrack: null,
      audioVolume: 0.5,
      audioMuted: false,
    },
    
    guidedNavigation: {
      routes: [],
      currentRouteId: null,
      isPlaying: false,
      currentStepIndex: 0,
    },
    
    shop: {
      products: [],
      cart: [],
      categories: [],
      selectedCategoryId: null,
    },
    
    // Actions
    actions: {
      // Configuration
      updateMatterportConfig: (config) => set((state) => {
        state.matterportConfig = mergeConfig(config);
      }),
      
      // UI
      setTheme: (theme) => set((state) => {
        state.ui.theme = theme;
      }),
      
      toggleSidebar: () => set((state) => {
        state.ui.sidebarOpen = !state.ui.sidebarOpen;
      }),
      
      setCurrentView: (view) => set((state) => {
        state.ui.currentView = view;
      }),
      
      setLoading: (loading) => set((state) => {
        state.ui.loading = loading;
      }),
      
      setInterfaceTab: (tab) => set((state) => {
        state.ui.interfaceTab = tab;
      }),
      
      // Tags
      addTag: (tag) => set((state) => {
        state.tags.items.push(tag);
      }),
      
      updateTag: (id, data) => set((state) => {
        const index = state.tags.items.findIndex((tag) => tag.id === id);
        if (index !== -1) {
          state.tags.items[index] = { ...state.tags.items[index], ...data };
        }
      }),
      
      removeTag: (id) => set((state) => {
        state.tags.items = state.tags.items.filter((tag) => tag.id !== id);
        if (state.tags.selectedTagId === id) {
          state.tags.selectedTagId = null;
        }
      }),
      
      selectTag: (id) => set((state) => {
        state.tags.selectedTagId = id;
      }),
      
      // Objets 3D
      addObject3D: (object) => set((state) => {
        state.objects3D.items.push(object);
      }),
      
      updateObject3D: (id, data) => set((state) => {
        const index = state.objects3D.items.findIndex((obj) => obj.id === id);
        if (index !== -1) {
          state.objects3D.items[index] = { ...state.objects3D.items[index], ...data };
        }
      }),
      
      removeObject3D: (id) => set((state) => {
        state.objects3D.items = state.objects3D.items.filter((obj) => obj.id !== id);
        if (state.objects3D.selectedObjectId === id) {
          state.objects3D.selectedObjectId = null;
        }
      }),
      
      selectObject3D: (id) => set((state) => {
        state.objects3D.selectedObjectId = id;
      }),
      
      // Médias
      addVideo: (video) => set((state) => {
        state.media.videos.push(video);
      }),
      
      removeVideo: (id) => set((state) => {
        state.media.videos = state.media.videos.filter((video) => video.id !== id);
      }),
      
      addAudioTrack: (track) => set((state) => {
        state.media.audioTracks.push(track);
      }),
      
      removeAudioTrack: (id) => set((state) => {
        state.media.audioTracks = state.media.audioTracks.filter((track) => track.id !== id);
        if (state.media.currentAudioTrack === id) {
          state.media.currentAudioTrack = null;
        }
      }),
      
      setCurrentAudioTrack: (id) => set((state) => {
        state.media.currentAudioTrack = id;
      }),
      
      setAudioVolume: (volume) => set((state) => {
        state.media.audioVolume = Math.max(0, Math.min(1, volume));
      }),
      
      toggleAudioMuted: () => set((state) => {
        state.media.audioMuted = !state.media.audioMuted;
      }),
      
      // Navigation guidée
      addRoute: (route) => set((state) => {
        state.guidedNavigation.routes.push(route);
      }),
      
      updateRoute: (id, data) => set((state) => {
        const index = state.guidedNavigation.routes.findIndex((route) => route.id === id);
        if (index !== -1) {
          state.guidedNavigation.routes[index] = { 
            ...state.guidedNavigation.routes[index], 
            ...data,
            steps: data.steps || state.guidedNavigation.routes[index].steps
          };
        }
      }),
      
      removeRoute: (id) => set((state) => {
        state.guidedNavigation.routes = state.guidedNavigation.routes.filter((route) => route.id !== id);
        if (state.guidedNavigation.currentRouteId === id) {
          state.guidedNavigation.currentRouteId = null;
          state.guidedNavigation.isPlaying = false;
          state.guidedNavigation.currentStepIndex = 0;
        }
      }),
      
      startGuidedNavigation: (routeId) => set((state) => {
        state.guidedNavigation.currentRouteId = routeId;
        state.guidedNavigation.isPlaying = true;
        state.guidedNavigation.currentStepIndex = 0;
      }),
      
      stopGuidedNavigation: () => set((state) => {
        state.guidedNavigation.isPlaying = false;
      }),
      
      nextStep: () => set((state) => {
        if (state.guidedNavigation.currentRouteId) {
          const route = state.guidedNavigation.routes.find(
            (r) => r.id === state.guidedNavigation.currentRouteId
          );
          if (route && state.guidedNavigation.currentStepIndex < route.steps.length - 1) {
            state.guidedNavigation.currentStepIndex += 1;
          } else {
            state.guidedNavigation.isPlaying = false;
          }
        }
      }),
      
      previousStep: () => set((state) => {
        if (state.guidedNavigation.currentStepIndex > 0) {
          state.guidedNavigation.currentStepIndex -= 1;
        }
      }),
      
      // Boutique
      addProduct: (product) => set((state) => {
        state.shop.products.push(product);
      }),
      
      updateProduct: (id, data) => set((state) => {
        const index = state.shop.products.findIndex((product) => product.id === id);
        if (index !== -1) {
          state.shop.products[index] = { ...state.shop.products[index], ...data };
        }
      }),
      
      removeProduct: (id) => set((state) => {
        state.shop.products = state.shop.products.filter((product) => product.id !== id);
      }),
      
      addToCart: (productId, quantity) => set((state) => {
        const existingItem = state.shop.cart.find((item) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.shop.cart.push({ productId, quantity });
        }
      }),
      
      removeFromCart: (productId) => set((state) => {
        state.shop.cart = state.shop.cart.filter((item) => item.productId !== productId);
      }),
      
      updateCartItemQuantity: (productId, quantity) => set((state) => {
        const item = state.shop.cart.find((item) => item.productId === productId);
        if (item) {
          if (quantity <= 0) {
            state.shop.cart = state.shop.cart.filter((item) => item.productId !== productId);
          } else {
            item.quantity = quantity;
          }
        }
      }),
      
      clearCart: () => set((state) => {
        state.shop.cart = [];
      }),
      
      selectCategory: (id) => set((state) => {
        state.shop.selectedCategoryId = id;
      }),
    },
  }))
);
