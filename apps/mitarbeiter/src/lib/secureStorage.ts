import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Speicher-Adapter für Supabase-Sitzungen.
 * Native: Keychain (iOS) / Keystore (Android) über expo-secure-store.
 * SecureStore empfiehlt Werte < 2048 Byte, daher wird in Blöcke aufgeteilt.
 * Web (nur Vorschau): sessionStorage, keine dauerhafte Speicherung.
 */
export const CHUNK_SIZE = 1800;

export type KeyValueBackend = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const sanitizeKey = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, '_');

export function createChunkedStorage(backend: KeyValueBackend, chunkSize = CHUNK_SIZE) {
  const countKey = (key: string) => `${sanitizeKey(key)}.chunks`;
  const chunkKey = (key: string, i: number) => `${sanitizeKey(key)}.${i}`;

  async function removeItem(key: string) {
    const count = Number((await backend.getItem(countKey(key))) ?? '0');
    for (let i = 0; i < count; i++) await backend.removeItem(chunkKey(key, i));
    await backend.removeItem(countKey(key));
  }

  return {
    async getItem(key: string): Promise<string | null> {
      const raw = await backend.getItem(countKey(key));
      if (raw === null) return null;
      const count = Number(raw);
      const parts: string[] = [];
      for (let i = 0; i < count; i++) {
        const part = await backend.getItem(chunkKey(key, i));
        if (part === null) return null;
        parts.push(part);
      }
      return parts.join('');
    },
    async setItem(key: string, value: string): Promise<void> {
      await removeItem(key);
      const chunks = Math.max(1, Math.ceil(value.length / chunkSize));
      for (let i = 0; i < chunks; i++) {
        await backend.setItem(chunkKey(key, i), value.slice(i * chunkSize, (i + 1) * chunkSize));
      }
      await backend.setItem(countKey(key), String(chunks));
    },
    removeItem,
  };
}

const nativeBackend: KeyValueBackend = {
  getItem: (k) => SecureStore.getItemAsync(k),
  setItem: (k, v) => SecureStore.setItemAsync(k, v),
  removeItem: (k) => SecureStore.deleteItemAsync(k),
};

const memory = new Map<string, string>();
const webBackend: KeyValueBackend = {
  getItem: async (k) => {
    const g = globalThis as { sessionStorage?: Storage };
    return g.sessionStorage ? g.sessionStorage.getItem(k) : (memory.get(k) ?? null);
  },
  setItem: async (k, v) => {
    const g = globalThis as { sessionStorage?: Storage };
    if (g.sessionStorage) g.sessionStorage.setItem(k, v);
    else memory.set(k, v);
  },
  removeItem: async (k) => {
    const g = globalThis as { sessionStorage?: Storage };
    if (g.sessionStorage) g.sessionStorage.removeItem(k);
    else memory.delete(k);
  },
};

export const secureSessionStorage = createChunkedStorage(
  Platform.OS === 'web' ? webBackend : nativeBackend,
);
