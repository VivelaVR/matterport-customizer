/**
 * Wrapper pour le SDK Matterport
 */

import { MatterportConfig } from './config';

// Types pour le SDK Matterport
export interface MatterportSDK {
  MatterportViewer: any;
  setupViewer: (containerId: string, config: any) => Promise<any>;
  connect: (iframe: HTMLIFrameElement) => Promise<any>;
}

// Types pour le Showcase SDK
export interface ShowcaseSDK {
  Mattertag: {
    add: (tagData: any) => Promise<string[]>;
    remove: (tagIds: string[]) => Promise<void>;
    getData: (tagIds: string[]) => Promise<any[]>;
    editPosition: (tagId: string, position: any) => Promise<void>;
    editColor: (tagId: string, color: string) => Promise<void>;
    editIcon: (tagId: string, iconUrl: string) => Promise<void>;
    editLabel: (tagId: string, label: string) => Promise<void>;
    editDescription: (tagId: string, description: string) => Promise<void>;
  };
  Model: {
    getData: () => Promise<any>;
  };
  Camera: {
    getPose: () => Promise<any>;
    setPose: (position: any, rotation: any) => Promise<void>;
    moveToTag: (tagId: string, transition?: any) => Promise<void>;
  };
  Mode: {
    current: () => Promise<string>;
    moveTo: (mode: string) => Promise<void>;
  };
  Tour: {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    getData: () => Promise<any>;
  };
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
}

// Classe pour gérer l'intégration avec le SDK Matterport
export class MatterportSDKManager {
  private static instance: MatterportSDKManager;
  private sdk: MatterportSDK | null = null;
  private showcase: ShowcaseSDK | null = null;
  private config: MatterportConfig;
  private isInitialized = false;

  private constructor(config: MatterportConfig) {
    this.config = config;
  }

  // Singleton pattern
  public static getInstance(config: MatterportConfig): MatterportSDKManager {
    if (!MatterportSDKManager.instance) {
      MatterportSDKManager.instance = new MatterportSDKManager(config);
    }
    return MatterportSDKManager.instance;
  }

  // Initialiser le SDK
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Charger le SDK Matterport
      await this.loadSDK();
      
      this.isInitialized = true;
      console.log('Matterport SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Matterport SDK:', error);
      throw error;
    }
  }

  // Charger le SDK Matterport
  private async loadSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Vérifier si le SDK est déjà chargé
      if (window.MP_SDK) {
        this.sdk = window.MP_SDK;
        resolve();
        return;
      }

      // Créer un script pour charger le SDK
      const script = document.createElement('script');
      script.src = 'https://static.matterport.com/showcase-sdk/latest.js';
      script.async = true;
      script.onload = () => {
        if (window.MP_SDK) {
          this.sdk = window.MP_SDK;
          resolve();
        } else {
          reject(new Error('Matterport SDK not available after loading'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Matterport SDK'));
      };

      document.head.appendChild(script);
    });
  }

  // Connecter à un iframe Showcase
  public async connectToShowcase(iframe: HTMLIFrameElement): Promise<ShowcaseSDK> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.sdk) {
      throw new Error('Matterport SDK not initialized');
    }

    try {
      this.showcase = await this.sdk.connect(iframe);
      return this.showcase;
    } catch (error) {
      console.error('Failed to connect to Matterport Showcase:', error);
      throw error;
    }
  }

  // Créer un viewer Matterport
  public async createViewer(containerId: string): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.sdk) {
      throw new Error('Matterport SDK not initialized');
    }

    try {
      const mpSdk = this.sdk;
      const viewerOptions = {
        space: this.config.modelId,
        applicationKey: this.config.apiKey,
        ...this.config.options
      };

      return await mpSdk.setupViewer(containerId, viewerOptions);
    } catch (error) {
      console.error('Failed to create Matterport viewer:', error);
      throw error;
    }
  }

  // Obtenir l'instance Showcase
  public getShowcase(): ShowcaseSDK {
    if (!this.showcase) {
      throw new Error('Not connected to Matterport Showcase');
    }
    return this.showcase;
  }
}

// Ajouter les types au window global
declare global {
  interface Window {
    MP_SDK?: MatterportSDK;
  }
}
