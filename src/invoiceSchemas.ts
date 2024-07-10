export const AddInvoiceSchema = {
    description: 'Create a new invoice',
    tags: ['invoices'],
    summary: 'Creates new invoice with given values',
    body: {
        type: 'object',
        properties: {
            portal_name: {type: 'string', maxLength: 100},
            invoice_number: {type: 'string', maxLength: 100},
            po_number: {type: 'string', maxLength: 100},
            buyer: {type: 'string', maxLength: 100},
            status: {
                type: 'string',
                enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
            },
            invoice_date: {type: 'string', format: 'date'},
            currency: {type: 'string', pattern: '^[A-Z]{3}$'},
            total: {type: 'number'},
        },
        required: ['portal_name', 'invoice_number', 'buyer', 'status', 'invoice_date', 'currency', 'total'],
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                portal_name: {type: 'string'},
                invoice_number: {type: 'string'},
                po_number: {type: 'string'},
                buyer: {type: 'string'},
                status: {
                    type: 'string',
                    enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
                },
                invoice_date: {type: 'string', format: 'date'},
                currency: {type: 'string', pattern: '^[A-Z]{3}$'},
                total: {type: 'number'}
            },
        },
    },
};

export const PutInvoiceSchema = {
    description: 'Updates existing invoice',
    tags: ['invoices'],
    summary: 'Updates invoice by Id with given values',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Invoice Id',
            },
        },
    },
    body: {
        type: 'object',
        properties: {
            portal_name: {type: 'string', maxLength: 100},
            invoice_number: {type: 'string', maxLength: 100},
            po_number: {type: 'string', maxLength: 100},
            buyer: {type: 'string', maxLength: 100},
            status: {
                type: 'string',
                enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
            },
            invoice_date: {type: 'string', format: 'date'},
            currency: {type: 'string', pattern: '^[A-Z]{3}$'},
            total: {type: 'number'},
        },
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                portal_name: {type: 'string'},
                invoice_number: {type: 'string'},
                po_number: {type: 'string'},
                buyer: {type: 'string'},
                status: {
                    type: 'string',
                    enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
                },
                invoice_date: {type: 'string', format: 'date'},
                currency: {type: 'string', pattern: '^[A-Z]{3}$'},
                total: {type: 'number'},
            },
        },
    },
};

export const GetInvoiceSchema = {
    description: 'Gets a single invoice',
    tags: ['invoices'],
    summary: 'Gets invoice by Id',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Invoice Id',
            },
        },
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                portal_name: {type: 'string'},
                invoice_number: {type: 'string'},
                po_number: {type: 'string'},
                buyer: {type: 'string'},
                status: {
                    type: 'string',
                    enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
                },
                invoice_date: {type: 'string', format: 'date'},
                currency: {type: 'string', pattern: '^[A-Z]{3}$'},
                total: {type: 'number'},
            },
        },
    },
};

export const DeleteInvoiceSchema = {
    description: 'Deletes a single invoice',
    tags: ['invoices'],
    summary: 'Deletes invoice by Id',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Invoice Id',
            },
        },
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                portal_name: {type: 'string'},
                invoice_number: {type: 'string'},
                po_number: {type: 'string'},
                buyer: {type: 'string'},
                status: {
                    type: 'string',
                    enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
                },
                invoice_date: {type: 'string', format: 'date'},
                currency: {type: 'string', pattern: '^[A-Z]{3}$'},
                total: {type: 'number'},
            },
        },
    },
};

export const GetInvoicesSchema = {
    description: 'Get invoices with optional filters',
    tags: ['invoices'],
    summary: 'Fetches invoices based on provided filters',
    querystring: {
        type: 'object',
        properties: {
            portal_name: {type: 'string', maxLength: 100},
            invoice_number: {type: 'string', maxLength: 100},
            po_number: {type: 'string', maxLength: 100},
            buyer: {type: 'string', maxLength: 100},
            status: {
                type: 'string',
                enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
            },
            start_date: {type: 'string', format: 'date'},
            end_date: {type: 'string', format: 'date'},
            currency: {type: 'string', pattern: '^[A-Z]{3}$'},
            min_total: {type: 'number'},
            max_total: {type: 'number'}
        },
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {type: 'string'},
                    portal_name: {type: 'string'},
                    invoice_number: {type: 'string'},
                    po_number: {type: 'string'},
                    buyer: {type: 'string'},
                    status: {
                        type: 'string',
                        enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
                    },
                    invoice_date: {type: 'string', format: 'date'},
                    currency: {type: 'string', pattern: '^[A-Z]{3}$'},
                    total: {type: 'number'}
                }
            }
        }
    }
};

export const ScrapeInvoiceSchema = {
    description: 'Scrape invoices from Monto',
    tags: ['invoices'],
    summary: 'Scrapes invoices from Monto',
    querystring: {
        type: 'object',
        properties: {
            portal_name: {type: 'string', maxLength: 100},
            status: {
                type: 'string',
                enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
            },
            start_date: {type: 'string', format: 'date'},
            end_date: {type: 'string', format: 'date'},
        },
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    portal_name: {type: 'string'},
                    buyer: {
                        type: 'object',
                        properties: {
                            mapped_value: {type: 'string'},
                            airtable_id: {type: 'string'}
                        }
                    },
                    invoice_number: {type: 'string'},
                    monto_customer: {type: 'string'},
                    status: {
                        type: 'string',
                        enum: ["Approved", "Pending Approval", "Paid", "Rejected", "Canceled", 'in_process']
                    },
                    invoice_date: {type: 'string', format: 'date'},
                    created_time: {type: 'string', format: 'date'},
                    total: {type: 'number'}
                }
            }
        }
    }
};
