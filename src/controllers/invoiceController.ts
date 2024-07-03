import {FastifyRequest, FastifyReply} from 'fastify';
import {ObjectId} from 'mongodb';
import {invoicesCollection} from '../utils/mongo.js';
import {MontoInvoice, MontoInvoiceStatus} from "../models/Invoice.js";

export const getInvoices = async (req: FastifyRequest, reply: FastifyReply) => {
    const query: any = {};
    const filters = req.query as {
        portal_name?: string;
        invoice_number?: string;
        po_number?: string;
        buyer?: string;
        status?: keyof MontoInvoiceStatus;
        start_date?: string;
        end_date?: string;
        currency?: string;
        min_total?: number;
        max_total?: number;
    };
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
            switch (key) {
                case 'start_date':
                case 'end_date':
                    if (!query.invoice_date) query.invoice_date = {};
                    if (key === 'start_date') query.invoice_date.$gte = value;
                    if (key === 'end_date') query.invoice_date.$lte = value;
                    break;
                case 'min_total':
                case 'max_total':
                    if (!query.total) query.total = {};
                    if (key === 'min_total') query.total.$gte = value;
                    if (key === 'max_total') query.total.$lte = value;
                    break;
                default:
                    query[key] = value;
            }
        }
    });
    const invoices = await invoicesCollection.find(query).toArray();
    reply.send(invoices);
};

export const getInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    const {id} = req.params as { id: string };
    const invoice = await invoicesCollection.findOne({_id: new ObjectId(id)});
    if (!invoice) {
        reply.code(404).send({error: 'Invoice not found'});
    } else {
        reply.send(invoice);
    }
};

export const addInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    const invoice = req.body as MontoInvoice;
    await invoicesCollection.insertOne(invoice);
    reply.send(invoice);
};

export const updateInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    const {id} = req.params as { id: string };
    const invoice = req.body as MontoInvoice;
    const result = await invoicesCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: invoice},
        {returnDocument: 'after'}
    );
    if (!result) {
        reply.code(404).send({error: 'Invoice not found'});
    } else {
        reply.send(result);
    }
};

export const deleteInvoice = async (req: FastifyRequest, reply: FastifyReply) => {
    const {id} = req.params as { id: string };
    const result = await invoicesCollection.findOneAndDelete({_id: new ObjectId(id)});
    if (!result) {
        reply.code(404).send({error: 'Invoice not found'});
    } else {
        reply.send(result);
    }
};
