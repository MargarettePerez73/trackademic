import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

function isAsyncStorageNativeModuleError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.toLowerCase().includes('native module is null')
    || msg.toLowerCase().includes('cannot access legacy storage');
}

async function safeGetItem(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    if (isAsyncStorageNativeModuleError(err)) return null;
    throw err;
  }
}

async function safeSetItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    if (isAsyncStorageNativeModuleError(err)) return;
    throw err;
  }
}

async function safeRemoveItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    if (isAsyncStorageNativeModuleError(err)) return;
    throw err;
  }
}


export interface AuthUser {
  id: number;
  sr_code: string;
  name: string;
  full_name: string;
  username: string;
  email: string;
  section?: string;
  year_level?: number;
  course?: string;
}

const AUTH_KEY = '@trackademic_user';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (userData: AuthUser) => {
    setUser(userData);
    await safeSetItem(AUTH_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await safeRemoveItem(AUTH_KEY);
  }, []);

  const restoreSession = useCallback(async () => {
    const stored = await safeGetItem(AUTH_KEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);


  return { user, login, logout, restoreSession };
}
