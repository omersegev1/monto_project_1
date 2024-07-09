import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cacheSet, cacheGet } from "./src/utils/cache.js";
import { getAuthentication, getInvoices } from "./src/utils/scraper.js";

const credentials = {
    rootUrl: process.env.ROOT_URL!,
    username: process.env.USER_NAME!,
    password: process.env.PASSWORD!,
};

describe("Cache Utility", () => {
    const key = "test_key";
    const value = { foo: "bar" };
    const ttl = 1000;

    it("Should set a cache key", () => {
        assert.doesNotThrow(() => cacheSet(key, value, ttl));
    });

    it("Should retrieve a cache key", () => {
        assert.deepStrictEqual(cacheGet(key), value);
    });

    it("Should retrieve an expired cache key", async () => {
        const cachePromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const value = cacheGet(key);
                resolve(value);
            }, ttl);
        });

        const cachePromiseValue = await cachePromise;
        assert.deepStrictEqual(cachePromiseValue, null);
    });
});

describe("Invoices Data Extractor", () => {
    it("Should get authentication", async () => {
        const authentication = await getAuthentication(credentials);
        assert(authentication.token);
    });

    it("Should get scraped invoices", async () => {
        const authentication = await getAuthentication(credentials);
        const invoices = await getInvoices(authentication);
        assert(invoices.length > 0);
    });

    it("Should get scraped filtered invoices", async () => {
        const authentication = await getAuthentication(credentials);
        const filters = {
            invoice_date: new Date("2024-02-04")
        };
        const invoices = await getInvoices(authentication, filters);
        assert(invoices.length > 0);
    });

    it("Should get scraped invoices from API", async () => {
        const url = "http://localhost:3000/invoices/scrape";
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();

        assert(data.length > 0);
    });
});