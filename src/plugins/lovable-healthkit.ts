import { registerPlugin, Capacitor, PluginListenerHandle } from '@capacitor/core';

export interface StepDay {
  date: string; // ISO date (start of day)
  steps: number;
}

export interface LovableHealthKitPlugin {
  requestAuthorization(): Promise<{ granted: boolean }>;
  getStepCountLast7Days(): Promise<{ days: StepDay[] }>;
  addListener?(
    eventName: 'healthkit_log',
    listenerFunc: (data: { message: string }) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}

// Register plugin with extensive startup logging
export const LovableHealthKit = registerPlugin<LovableHealthKitPlugin>('LovableHealthKit', {
  web: () => {
    const webImpl: LovableHealthKitPlugin = {
      async requestAuthorization() {
        console.warn('[LovableHealthKit][web] requestAuthorization() called in web environment. Returning granted: false');
        return { granted: false };
      },
      async getStepCountLast7Days() {
        console.warn('[LovableHealthKit][web] getStepCountLast7Days() called in web. Returning mock zeros.');
        // Return simple mock to keep UI functional in browser
        const days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
          return { date: iso, steps: 0 };
        });
        return { days };
      },
    };
    return webImpl as any;
  },
});

console.log('[LovableHealthKit] Platform:', Capacitor.getPlatform());

export async function ensureHealthPermissions(): Promise<boolean> {
  try {
    console.log('[LovableHealthKit] Requesting HealthKit authorization...');
    const { granted } = await LovableHealthKit.requestAuthorization();
    console.log('[LovableHealthKit] Authorization result:', granted);
    return granted;
  } catch (err) {
    console.error('[LovableHealthKit] Authorization error:', err);
    return false;
  }
}

export async function fetchLast7DaysSteps(): Promise<StepDay[]> {
  try {
    console.log('[LovableHealthKit] Fetching last 7 days steps...');
    const { days } = await LovableHealthKit.getStepCountLast7Days();
    console.log('[LovableHealthKit] Retrieved days:', days);
    return days;
  } catch (err) {
    console.error('[LovableHealthKit] Fetch error:', err);
    return [];
  }
}
