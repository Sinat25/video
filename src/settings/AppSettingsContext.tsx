import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * App settings stored locally.
 * We keep it tiny: just the status bar visibility switch for now.
 */
const SHOW_STATUS_BAR_KEY = 'SETTINGS_SHOW_STATUS_BAR';

type AppSettingsContextValue = {
  showStatusBar: boolean;
  setShowStatusBar: (value: boolean) => void;
  settingsLoaded: boolean;
};

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [showStatusBar, setShowStatusBarState] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(SHOW_STATUS_BAR_KEY);
        if (!mounted) return;
        if (raw !== null) {
          setShowStatusBarState(Boolean(JSON.parse(raw)));
        }
      } catch (e) {
        // If something goes wrong, keep defaults.
      } finally {
        if (mounted) setSettingsLoaded(true);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const setShowStatusBar = (value: boolean) => {
    setShowStatusBarState(value);
    AsyncStorage.setItem(SHOW_STATUS_BAR_KEY, JSON.stringify(value)).catch(() => {});
  };

  const value = useMemo(
    () => ({ showStatusBar, setShowStatusBar, settingsLoaded }),
    [showStatusBar, settingsLoaded]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}
