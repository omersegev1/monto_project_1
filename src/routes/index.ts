import * as invoiceController from '../controllers/invoiceController.js';
import {RouteOptions} from 'fastify';
import {
    AddInvoiceSchema,
    GetInvoiceSchema,
    GetInvoicesSchema,
    PutInvoiceSchema,
    DeleteInvoiceSchema
} from '../invoiceSchemas.js';

const getInvoicesRoute: RouteOptions = {
    method: 'GET',
    url: '/invoice',
    handler: invoiceController.getInvoices,
    schema: GetInvoicesSchema,
};

const getInvoiceRoute: RouteOptions = {
    method: 'GET',
    url: '/invoice/:id',
    handler: invoiceController.getInvoice,
    schema: GetInvoiceSchema,
};

const postInvoiceRoute: RouteOptions = {
    method: 'POST',
    url: '/invoice',
    handler: invoiceController.addInvoice,
    schema: AddInvoiceSchema,
};

const putInvoiceRoute: RouteOptions = {
    method: 'PUT',
    url: '/invoice/:id',
    handler: invoiceController.updateInvoice,
    schema: PutInvoiceSchema,
};

const deleteInvoiceRoute: RouteOptions = {
    method: 'DELETE',
    url: '/invoice/:id',
    handler: invoiceController.deleteInvoice,
    schema: DeleteInvoiceSchema,
};

const routes = [
    getInvoicesRoute,
    getInvoiceRoute,
    postInvoiceRoute,
    putInvoiceRoute,
    deleteInvoiceRoute
];

export default routes;
