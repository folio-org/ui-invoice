import { invoice } from '../../../test/jest/fixtures';
import {
  saveInvoice,
  validateAccountingCode,
} from './utils';

const okapi = {
  tenant: 'diku',
  token: 'asd',
  url: 'folio-okapi',
};

describe('Invoice form utils', () => {
  describe('saveInvoice', () => {
    beforeEach(() => {
      global.originalFetch = global.fetch;

      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch = global.originalFetch;
    });

    it('should make POST request to save invoice', async () => {
      const invoiceMutator = {
        POST: jest.fn().mockReturnValue(invoice),
      };

      await saveInvoice({ ...invoice, id: null }, [], invoiceMutator, okapi);

      expect(invoiceMutator.POST).toHaveBeenCalled();
    });

    it('should make PUT request to save invoice', async () => {
      const invoiceMutator = {
        PUT: jest.fn().mockReturnValue(invoice),
      };

      await saveInvoice(invoice, [], invoiceMutator, okapi);

      expect(invoiceMutator.PUT).toHaveBeenCalled();
    });

    it('should make POST requests to save invoice documents', async () => {
      const invoiceMutator = {
        POST: jest.fn().mockReturnValue(invoice),
      };
      const invoiceWithDocumnets = {
        ...invoice,
        id: null,
        documents: [{ name: 'Invoice document', data: 'invoice content' }],
        // links: [{ name: 'Invoice link', url: 'https://folio.com' }],
      };

      global.fetch.mockClear().mockReturnValue(Promise.resolve());

      await saveInvoice(invoiceWithDocumnets, [], invoiceMutator, okapi);

      expect(fetch).toHaveBeenCalledWith('folio-okapi/invoice/invoices/2e5067cd-2dc8-4d99-900d-b4518bb6407f/documents', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Okapi-Tenant': okapi.tenant,
          'Content-Type': 'application/octet-stream',
        },
        body: '{"documentMetadata":{"invoiceId":"2e5067cd-2dc8-4d99-900d-b4518bb6407f","name":"Invoice document"},"contents":{"data":"invoice content"}}',
      });
    });

    it('should make POST requests to save invoice links', async () => {
      const invoiceMutator = {
        POST: jest.fn().mockReturnValue(invoice),
      };
      const invoiceWithDocumnets = {
        ...invoice,
        id: null,
        links: [{ name: 'Invoice link', url: 'https://folio.com' }],
      };

      global.fetch.mockClear().mockReturnValue(Promise.resolve());

      await saveInvoice(invoiceWithDocumnets, [], invoiceMutator, okapi);

      expect(fetch).toHaveBeenCalledWith('folio-okapi/invoice/invoices/2e5067cd-2dc8-4d99-900d-b4518bb6407f/documents', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Okapi-Tenant': okapi.tenant,
          'Content-Type': 'application/octet-stream',
        },
        body: '{"documentMetadata":{"invoiceId":"2e5067cd-2dc8-4d99-900d-b4518bb6407f","name":"Invoice link","url":"https://folio.com"}}',
      });
    });

    it('should make DELETE request to delete invoice document/link', async () => {
      const invoiceMutator = {
        PUT: jest.fn().mockReturnValue(invoice),
      };
      const prevDocuments = [{ id: 'documentId', invoiceId: invoice.id }];

      global.fetch.mockClear().mockReturnValue(Promise.resolve());
      await saveInvoice(invoice, prevDocuments, invoiceMutator, okapi);

      expect(fetch).toHaveBeenCalledWith('folio-okapi/invoice/invoices/2e5067cd-2dc8-4d99-900d-b4518bb6407f/documents/documentId', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Okapi-Tenant': okapi.tenant,
          'Content-Type': 'application/json',
        },
      });
    });
  });
});

test('validateAccountingCode', () => {
  expect(validateAccountingCode('')).toBeTruthy();
  expect(validateAccountingCode(null)).toBeTruthy();
  expect(validateAccountingCode(undefined)).toBeTruthy();
  expect(validateAccountingCode('accounting code')).toBe(undefined);
});
