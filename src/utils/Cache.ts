import {promises as fs} from 'fs';

type CacheEntry = {
    data: any;
    ttl: number;
}

export class Cache {
    private static instance: Cache;
    private static initialized: boolean = false;
    private static intervalId:NodeJS.Timeout | null = null;

    private cache: { [key: string]: CacheEntry } = {};

    constructor() {
        if (Cache.instance) {
            return Cache.instance;
        }
        Cache.instance = this;
        return this;
    }

    public async init() {
        await this.loadCache();
        Cache.initialized = true;
        Cache.intervalId = setInterval(async () => {
            await this.saveCache();
        }, 1000 * 60);
    }

    //for testing purposes
    public async clearCacheInterval() {
        if(Cache.intervalId)
            clearInterval(Cache.intervalId);
            Cache.intervalId = null;
    }

    public async set(key: string, data: any, ttl: number = 1000 * 60 * 5): Promise<void> {
        if (!Cache.initialized) throw new Error('Cache not initialized');
        this.cache[key] = {
            data,
            ttl: Date.now() + ttl
        };
    }

    public async get(key: string): Promise<any> {
        if (!Cache.initialized) throw new Error('Cache not initialized');
        const entry = this.cache[key];
        if (!entry) return null;
        if (Date.now() > entry.ttl) {
            delete this.cache[key];
            return null;
        }
        return entry.data;
    }

    private async saveCache(): Promise<void> {
        await fs.writeFile("./cache.json", JSON.stringify(this.cache, null, 2));
    }

    private async loadCache(): Promise<void> {
        const cache = await fs.readFile("./cache.json", "utf-8");
        this.cache = JSON.parse(cache);
    }
}