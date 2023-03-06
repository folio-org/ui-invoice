import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import { useOrganization } from '@folio/stripes-acq-components';

import {
  match,
  history,
  location,
  invoice,
  batchGroup,
  vendor,
} from '../../../test/jest/fixtures';

import { useInvoice } from '../../common/hooks';
import InvoiceForm from './InvoiceForm';
import { saveInvoice } from './utils';
import { InvoiceFormContainerComponent } from './InvoiceFormContainer';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useOrganization: jest.fn(),
  };
});
jest.mock('./InvoiceForm', () => jest.fn().mockReturnValue('InvoiceForm'));
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  saveInvoice: jest.fn(),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useConfigsAdjustments: jest.fn().mockReturnValue({ adjustments: [], isLoading: false }),
  useInvoice: jest.fn(),
  useOrderLines: jest.fn().mockReturnValue({ orderLines: [], isLoading: false }),
  useOrders: jest.fn().mockReturnValue({ orders: [], isLoading: false }),
  useInvoiceLineMutation: jest.fn().mockReturnValue({ mutateInvoiceLine: jest.fn() }),
}));

const mutatorMock = {
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
  history,
  location,
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
  beforeEach(() => {
    useInvoice.mockClear().mockReturnValue({ isInvoiceLoading: false, invoice });
    useOrganization.mockClear().mockReturnValue({ isLoading: false, organization: vendor });
  });

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
