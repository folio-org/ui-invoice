import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useReactToPrint } from 'react-to-print';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import {
  match,
  invoice,
  batchGroup,
} from '../../../test/jest/fixtures';

import InvoiceForm from './InvoiceForm';
import { saveInvoice } from './utils';
import { InvoiceFormContainerComponent } from './InvoiceFormContainer';

jest.mock('./InvoiceForm', () => jest.fn().mockReturnValue('InvoiceForm'));
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  saveInvoice: jest.fn(),
}));

const mutatorMock = {
  invoice: {
    GET: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  },
  invoiceFormInvoices: {
    GET: jest.fn().mockReturnValue(Promise.resolve([invoice])),
  },
  duplicateInvoiceVendor: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ name: 'Amazon' })),
  },
  batchGroups: {
    GET: jest.fn().mockReturnValue(Promise.resolve([batchGroup])),
  },
  invoiceFormDocuments: {
    reset: jest.fn(),
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
};
const resources = {};
const defaultProps = {
  match: {
    ...match,
    params: { id: '' },
  },
  mutator: mutatorMock,
  resources,
  okapi: {},
  stripes: { currency: 'USD' },
  onCancel: jest.fn(),
};
const renderInvoiceFormContainer = (props = defaultProps) => render(
  <InvoiceFormContainerComponent {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceFormContainer', () => {
  it('should not display InvoiceForm when loading', () => {
    renderInvoiceFormContainer({
      ...defaultProps,
      match,
    });

    expect(screen.queryByText('InvoiceForm')).toBeNull();
  });

  it('should display InvoiceForm when loaded', async () => {
    renderInvoiceFormContainer();

    await screen.findByText('InvoiceForm');

    expect(screen.getByText('InvoiceForm')).toBeDefined();
  });

  describe('Save', () => {
    beforeEach(() => {
      InvoiceForm.mockClear();
    });

    it('should validate invoice duplication before save', async () => {
      renderInvoiceFormContainer();

      await screen.findByText('InvoiceForm');

      await act(async () => {
        await InvoiceForm.mock.calls[0][0].onSubmit(invoice);
      });

      await screen.findByText('ui-invoice.invoice.isNotUnique.confirmation.heading');

      expect(screen.getByText('ui-invoice.invoice.isNotUnique.confirmation.message')).toBeDefined();
    });

    it('should save invoice when duplicates confirmed', async () => {
      saveInvoice.mockClear().mockReturnValue(Promise.resolve(invoice));
      renderInvoiceFormContainer();

      await screen.findByText('InvoiceForm');

      await act(async () => {
        await InvoiceForm.mock.calls[0][0].onSubmit(invoice);
      });

      await screen.findByText('ui-invoice.invoice.isNotUnique.confirmation.heading');

      user.click(screen.getByText('ui-invoice.button.submit'));

      await waitFor(() => !screen.queryByRole('ui-invoice.invoice.isNotUnique.confirmation.heading'));

      expect(saveInvoice).toHaveBeenCalled();
    });
  });
});
