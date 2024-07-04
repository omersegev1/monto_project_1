import fs from 'fs';

interface CacheEntry {
    data: any;
    ttl: number;
}

const cacheFilePath =  './cache.json';

const loadCache = (): Record<string, CacheEntry> => {
    try {
        const fileContent = fs.readFileSync(cacheFilePath, {encoding: 'utf-8'});
        return JSON.parse(fileContent);
    } catch (err) {
        return {};
    }
};

const saveCache = (cache: Record<string, CacheEntry>) => {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache,null,2), {encoding: 'utf-8'});
}

const cacheSet = (key: string, data: any, ttl: number) => {
    const cache = loadCache();
    cache[key] = {
        data,
        ttl: Date.now() + ttl
    };
    saveCache(cache);
};

const cacheGet = (key: string) => {
    const cache = loadCache();
    const entry = cache[key];
    if(!entry) return null;
    if (Date.now() > entry.ttl){
        delete cache[key];
        saveCache(cache);
        return null;
    }
   return entry.data;
};

export {cacheSet, cacheGet};