import {ObjectId} from 'mongodb';

export const MontoInvoiceStatus = {
    APPROVED: "Approved",
    PENDING_APPROVAL: "Pending Approval",
    PAID: "Paid",
    REJECTED: "Rejected",
    CANCELED: "Canceled",
    IN_PROCESS: "in_process",
} as const;

export type MontoInvoiceStatus = typeof MontoInvoiceStatus[keyof typeof MontoInvoiceStatus];

export interface MontoInvoice {
    _id: ObjectId;
    portal_name: string;
    invoice_number: string;
    po_number?: string;
    buyer: Buyer;
    status: MontoInvoiceStatus;
    invoice_date: Date;
    created_time: Date;
    currency: string;
    total: number;
}

interface Buyer {
    mapped_value: string;
    airtable_id: string;
}

export interface MontoCredential {
    rootUrl: string;
    username: string;
    password: string;
}

export interface MontoAuthentication {
    token: string;
}

export interface InvoiceFilters {
    start_date?: Date;
    end_date?: Date;
    portal_name?: string;
    status?: string;
}