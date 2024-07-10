import Sentry from "./sentry.js";
import puppeteer from 'puppeteer';
import {Cache} from "./Cache.js";
import {
    InvoiceFilters,
    MontoAuthentication,
    MontoCredential,
    MontoInvoice,
    MontoInvoiceStatus
} from "../models/Invoice.js";

export async function getAuthentication(credential: MontoCredential): Promise<MontoAuthentication> {

    const cache = new Cache();
    const key = hashCode(credential.username + credential.password);

    const cached = await cache.get(key);
    if (cached) {
        return cached;
    }

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(credential.rootUrl, {waitUntil: 'networkidle2'});
    await page.waitForSelector('input[name="username"]').then((el) => el?.type(credential.username));
    await page.waitForSelector('input[name="password"]').then((el) => el?.type(credential.password));

    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle2'}),
        page.click('button[type="submit"]')
    ]);

    // throw new Error('TEST: Error occurred trying to get screenshot on sentry.');

    const cookies = await page.cookies();
    const token = cookies.find(cookie => cookie.name === 'appSession')?.value;

    await browser.close();

    const data: MontoAuthentication = {
        token: token?.toString() || '',
    };

    await cache.set(key, data);
    return data;
}

export async function getInvoices(authentication: MontoAuthentication, filters?: InvoiceFilters): Promise<MontoInvoice[]> {

    const response = await fetch('https://backoffice.dev.montopay.com/api/monto/fetch_all_invoices?tab=new', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'cookie': `appSession=${authentication.token}`,
            'Referer': 'https://backoffice.dev.montopay.com/invoices?tab=new'
        }
    });

    const invoices = await response.json();
    return invoices.filter((invoice: MontoInvoice) => {
        const dateToCheck = new Date(invoice.invoice_date || invoice.created_time).getTime();

        if (filters?.start_date && dateToCheck <= new Date(filters.start_date).getTime()) {
            return false;
        }
        if (filters?.end_date && dateToCheck >= new Date(filters.end_date).getTime()) {
            return false;
        }
        if (filters?.portal_name && invoice.portal_name !== filters.portal_name) {
            return false;
        }
        if (filters?.status && validateStatus(filters.status)) {
            return false;
        }
        return true;
    });
}

export function validateStatus(status: string): boolean {
    return Object.values(MontoInvoiceStatus).includes(status as MontoInvoiceStatus);
}

export const hashCode = (str: string): string => {
    let hash = 0;
    if (str.length === 0) {
        return String(hash);
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    hash = hash >>> 0;
    return Number(hash).toString(32).toUpperCase();
};