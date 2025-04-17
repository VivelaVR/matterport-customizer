import { MatterportConfig } from './config';

// Étendre l'interface MatterportConfig pour inclure les options d'interface personnalisée
declare module './config' {
  interface MatterportConfig {
    customInterface?: {
      logoUrl?: string;
      showLogo?: boolean;
      accentColor?: string;
      showHelp?: boolean;
      showShare?: boolean;
      showVR?: boolean;
      showDollhouse?: boolean;
      showMeasurements?: boolean;
      title?: string;
      welcomeMessage?: string;
    };
  }
}

// Mettre à jour la configuration par défaut
export const defaultConfig: MatterportConfig = {
  apiKey: process.env.NEXT_PUBLIC_MATTERPORT_API_KEY || '',
  modelId: process.env.NEXT_PUBLIC_MATTERPORT_MODEL_ID || '',
  options: {
    enableNavControls: true,
    enableToolbar: true,
    language: 'fr',
    theme: 'light',
    quality: 'high',
  },
  tags: {
    defaultStyle: {
      color: '#1E88E5',
      fontSize: 14,
    },
  },
  objects3D: {
    modelsDirectory: '/models/',
  },
  audio: {
    defaultVolume: 0.5,
    enabled: true,
  },
  guidedNavigation: {
    transitionSpeed: 2,
    pauseDuration: 5,
  },
  customInterface: {
    showLogo: true,
    accentColor: '#1E88E5',
    showHelp: true,
    showShare: true,
    showVR: true,
    showDollhouse: true,
    showMeasurements: true,
  },
};

// Fonction pour fusionner la configuration par défaut avec la configuration personnalisée
export function mergeConfig(customConfig: Partial<MatterportConfig>): MatterportConfig {
  return {
    ...defaultConfig,
    ...customConfig,
    options: {
      ...defaultConfig.options,
      ...customConfig.options,
    },
    tags: {
      ...defaultConfig.tags,
      ...customConfig.tags,
      defaultStyle: {
        ...defaultConfig.tags.defaultStyle,
        ...customConfig.tags?.defaultStyle,
      },
    },
    objects3D: {
      ...defaultConfig.objects3D,
      ...customConfig.objects3D,
    },
    audio: {
      ...defaultConfig.audio,
      ...customConfig.audio,
    },
    guidedNavigation: {
      ...defaultConfig.guidedNavigation,
      ...customConfig.guidedNavigation,
    },
    customInterface: {
      ...defaultConfig.customInterface,
      ...customConfig.customInterface,
    },
  };
}
