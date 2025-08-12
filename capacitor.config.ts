import { CapacitorConfig } from '@capacitor/cli';

// Extensive logging for plugin inclusion and live-reload setup
const config: CapacitorConfig = {
  appId: 'app.lovable.475637aad02f46b19c51b34b81d639d7',
  appName: 'A Lovable project',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Enable live reload from Lovable sandbox preview
    url: 'https://475637aa-d02f-46b1-9c51-b34b81d639d7.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  loggingBehavior: 'debug',
};

export default config;
