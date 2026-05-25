interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class CacheService {
  private readonly STORAGE_KEY = 'sonivio_api_cache';
  private readonly DEFAULT_TTL = 60 * 60 * 1000; // 1 hour (Increased for safety)

  private getStorage(): Record<string, CacheEntry<any>> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  private setStorage(data: Record<string, CacheEntry<any>>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to cache storage', e);
    }
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const storage = this.getStorage();
    const expiry = Date.now() + ttl;
    storage[key] = { data, expiry };
    this.setStorage(storage);
  }

  get<T>(key: string): T | null {
    const storage = this.getStorage();
    const entry = storage[key];
    
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      delete storage[key];
      this.setStorage(storage);
      return null;
    }

    return entry.data as T;
  }

  // Get data even if expired (emergency fallback for 429 errors)
  getFallback<T>(key: string): T | null {
    const storage = this.getStorage();
    return storage[key]?.data || null;
  }

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const cacheService = new CacheService();
