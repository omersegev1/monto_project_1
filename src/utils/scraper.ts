import Sentry from "./sentry.js";
import puppeteer from 'puppeteer';
import {cacheGet, cacheSet} from './cache.js';
import {
    InvoiceFilters,
    MontoAuthentication,
    MontoCredential,
    MontoInvoice,
    MontoInvoiceStatus
} from "../models/Invoice.js";

export async function getAuthentication(credential: MontoCredential): Promise<MontoAuthentication> {


    const key = hashCode(credential.username + credential.password);

    const cached = await cacheGet(key);
    if (cached) {
        console.log('getting cached token...')
        return cached;
    }
    console.log('getting new token...');

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(credential.rootUrl, {waitUntil: 'networkidle2'});
    await page.waitForSelector('input[name="username"]').then((el) => el?.type(credential.username));
    await page.waitForSelector('input[name="password"]').then((el) => el?.type(credential.password));

    await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
    ]);

    const cookies = await page.cookies();
    const token = cookies.find(cookie => cookie.name === 'appSession')?.value;

    await browser.close();

    const data: MontoAuthentication = {
        token: token?.toString() || '',
    };

    cacheSet(key, data, 1000 * 60 * 5);

    return data;
}

export async function getInvoices(authentication: MontoAuthentication, filters?: InvoiceFilters): Promise<MontoInvoice[]> {

    console.log('getting invoices...');

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
        if (filters?.invoice_date && invoice.invoice_date !== filters.invoice_date) {
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