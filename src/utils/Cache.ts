import {promises as fs} from 'fs';

type CacheEntry = {
    data: any;
    ttl: number;
}

export class Cache {
    private static instance: Cache;
    private cache: { [key: string]: CacheEntry } = {};

    constructor() {
        if (Cache.instance) {
            return Cache.instance;
        }
        Cache.instance = this;

        this.loadCache();
        return this;
    }

    public async set(key: string, data: any, ttl: number = 1000 * 60 * 5): Promise<void> {
        this.cache[key] = {
            data,
            ttl: Date.now() + ttl
        };
        await this.saveCache();
    }

    public async get(key: string): Promise<any> {
        const entry = this.cache[key];
        if (!entry) return null;
        if (Date.now() > entry.ttl) {
            delete this.cache[key];
            await this.saveCache();
            return null;
        }
        return entry.data;
    }

    private async saveCache(): Promise<void> {
        await fs.writeFile("./cache.json", JSON.stringify(this.cache,null,2));
    }

    private async loadCache(): Promise<void> {
        const cache = await fs.readFile("./cache.json", "utf-8");
        this.cache = JSON.parse(cache);
    }
}