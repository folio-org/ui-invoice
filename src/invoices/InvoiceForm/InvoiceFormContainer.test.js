import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import user, { userEvent } from '@folio/jest-config-stripes/testing-library/user-event';
import {
  PAYMENT_METHOD_OPTIONS,
  useOrganization,
} from '@folio/stripes-acq-components';

import {
  batchGroup,
  history,
  invoice,
  location,
  match,
  orderLine,
  vendor,
} from 'fixtures';

import {
  useInvoice,
  useInvoiceLineMutation,
  useOrderLines,
  useOrders,
} from '../../common/hooks';
import { InvoiceFormContainerComponent } from './InvoiceFormContainer';
import { saveInvoice } from './utils';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitsField: () => <span>AcqUnitsField</span>,
  FieldOrganization: jest.fn(() => <span>FieldOrganization</span>),
  useExchangeCalculation: jest.fn(() => ({ isLoading: false, exchangedAmount: 30 })),
  useOrganization: jest.fn(),
}));
jest.mock('../InvoiceDetails/utils', () => ({
  ...jest.requireActual('../InvoiceDetails/utils'),
  createInvoiceLineFromPOL: jest.fn(() => ({})),
}));
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  saveInvoice: jest.fn(),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useAddressCategories: jest.fn().mockReturnValue({ addressCategories: [], isLoading: false }),
  useAdjustmentsSettings: jest.fn().mockReturnValue({ adjustmentPresets: [], isLoading: false }),
  useInvoice: jest.fn(),
  useInvoiceLineMutation: jest.fn(),
  useOrderLines: jest.fn(),
  useOrders: jest.fn(),
  usePayableFiscalYears: jest.fn(() => ({ fiscalYears: [] })),
}));

const mutatorMock = {
  invoiceFormInvoices: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
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
const renderInvoiceFormContainer = (props = {}) => render(
  <InvoiceFormContainerComponent
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('InvoiceFormContainer', () => {
  const mutateInvoiceLine = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    saveInvoice.mockResolvedValue(invoice);
    useInvoice.mockReturnValue({ isLoading: false, invoice });
    useInvoiceLineMutation.mockReturnValue({ mutateInvoiceLine });
    useOrderLines.mockReturnValue({ orderLines: [orderLine], isLoading: false });
    useOrders.mockReturnValue({ orders: [{ id: 'order1', vendor: 'vendor-id' }], isLoading: false });
    useOrganization.mockReturnValue({ isLoading: false, organization: vendor });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display InvoiceForm when loaded', async () => {
    renderInvoiceFormContainer();

    expect(await screen.findByText(/ui-invoice.invoice.paneTitle/)).toBeInTheDocument();
  });

  describe('Save', () => {
    const fillRequiredFields = async () => {
      await user.type(screen.getByRole('textbox', { name: 'ui-invoice.invoice.vendorInvoiceNo' }), '123');
      await user.type(screen.getByRole('textbox', { name: 'ui-invoice.invoice.details.information.invoiceDate' }), '2021-10-10');
      await user.selectOptions(screen.getByRole('combobox', { name: 'ui-invoice.invoice.paymentMethod' }), [PAYMENT_METHOD_OPTIONS[0].value]);
    };

    it('should save invoice created from an order', async () => {
      renderInvoiceFormContainer({
        location: {
          state: {
            orderIds: ['order1'],
          },
        },
      });

      await waitFor(() => expect(screen.getByText(/ui-invoice.invoice.paneTitle/)).toBeInTheDocument());
      await fillRequiredFields();
      await userEvent.click(screen.getByText('stripes-components.saveAndClose'));

      expect(saveInvoice).toHaveBeenCalled();
      expect(mutateInvoiceLine).toHaveBeenCalled();
    });

    it('should validate invoice duplication before save', async () => {
      mutatorMock.invoiceFormInvoices.GET.mockResolvedValue([invoice]);

      renderInvoiceFormContainer({
        match: {
          params: { id: 'id' },
        },
      });

      await waitFor(() => expect(screen.getByText(/ui-invoice.invoice.paneTitle/)).toBeInTheDocument());
      await userEvent.type(screen.getByRole('textbox', { name: 'ui-invoice.invoice.note' }), '123');
      await userEvent.click(screen.getByText('stripes-components.saveAndClose'));
      await screen.findByText('ui-invoice.invoice.isNotUnique.confirmation.heading');

      expect(screen.getByText('ui-invoice.invoice.isNotUnique.confirmation.message')).toBeDefined();
      expect(mutatorMock.duplicateInvoiceVendor.GET).toHaveBeenCalled();
    });

    it('should save invoice when duplicates confirmed', async () => {
      mutatorMock.invoiceFormInvoices.GET.mockResolvedValue([invoice]);

      renderInvoiceFormContainer({
        match: {
          params: { id: 'id' },
        },
      });

      await waitFor(() => expect(screen.getByText(/ui-invoice.invoice.paneTitle/)).toBeInTheDocument());
      await userEvent.type(screen.getByRole('textbox', { name: 'ui-invoice.invoice.note' }), '123');
      await userEvent.click(screen.getByText('stripes-components.saveAndKeepEditing'));
      await screen.findByText('ui-invoice.invoice.isNotUnique.confirmation.heading');
      await user.click(screen.getByText('ui-invoice.button.submit'));

      await waitFor(() => !screen.queryByRole('ui-invoice.invoice.isNotUnique.confirmation.heading'));

      expect(saveInvoice).toHaveBeenCalled();
    });
  });
});
