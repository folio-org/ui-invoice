import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  useOrderLine,
  useOrganization,
} from '@folio/stripes-acq-components';

import {
  invoice,
  invoiceLine,
  match,
  orderLine,
  vendor,
} from 'fixtures';
import {
  useFundDistributionValidation,
  useInvoice,
  useInvoiceLine,
} from '../../common/hooks';

import { showUpdateInvoiceError } from '../InvoiceDetails/utils';
import { InvoiceLineFormContainerComponent } from './InvoiceLineFormContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FundDistributionFieldsFinal: jest.fn().mockReturnValue('FundDistributionFieldsFinal'),
  useOrderLine: jest.fn(),
  useOrganization: jest.fn(),
}));

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useFundDistributionValidation: jest.fn(),
  useInvoice: jest.fn(),
  useInvoiceLine: jest.fn(),
}));

jest.mock('../InvoiceDetails/utils', () => ({
  ...jest.requireActual('../InvoiceDetails/utils'),
  showUpdateInvoiceError: jest.fn(),
}));

const mutatorMock = {
  invoiceLine: {
    POST: jest.fn().mockReturnValue(Promise.resolve()),
    PUT: jest.fn().mockReturnValue(Promise.resolve()),
  },
};
const resources = {};
const defaultProps = {
  location: {
    search: '',
  },
  match,
  mutator: mutatorMock,
  resources,
  onClose: jest.fn(),
  showCallout: jest.fn(),
};

const renderInvoiceLineFormContainer = (props = {}) => render(
  <InvoiceLineFormContainerComponent
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLineFormContainer', () => {
  beforeEach(() => {
    useFundDistributionValidation.mockClear().mockReturnValue({ validateFundDistributions: jest.fn() });
    useInvoice.mockClear().mockReturnValue({ invoice, isLoading: false });
    useInvoiceLine.mockClear().mockReturnValue({ invoiceLine, isLoading: false });
    useOrderLine.mockClear().mockReturnValue({ orderLine });
    useOrganization.mockClear().mockReturnValue({ organization: vendor });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display InvoiceLineForm when loaded', async () => {
    renderInvoiceLineFormContainer();

    expect(screen.getByText(/ui-invoice\.invoiceLine\.paneTitle\./)).toBeInTheDocument();
  });

  describe('Save', () => {
    const fillRequiredFields = async () => {
      await userEvent.type(screen.getByRole('textbox', { name: 'ui-invoice.invoiceLine.description' }), 'test');
      await userEvent.type(screen.getByRole('spinbutton', { name: 'ui-invoice.invoiceLine.quantity' }), '1');
      await userEvent.type(screen.getByRole('spinbutton', { name: 'ui-invoice.invoiceLine.subTotal' }), '1');
    };

    it('should make POST request to create invoice line', async () => {
      renderInvoiceLineFormContainer();

      await fillRequiredFields();
      await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mutatorMock.invoiceLine.POST).toHaveBeenCalled();
    });

    it('should make PUT request to update invoice line', async () => {
      renderInvoiceLineFormContainer({
        match: {
          ...match,
          params: {
            ...match.params,
            id: invoice.id,
            lineId: invoiceLine.id,
          },
        },
      });

      await fillRequiredFields();
      await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndKeepEditing' }));

      expect(mutatorMock.invoiceLine.PUT).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      mutatorMock.invoiceLine.POST.mockImplementation(() => Promise.reject());

      renderInvoiceLineFormContainer();

      await fillRequiredFields();
      await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(showUpdateInvoiceError).toHaveBeenCalled();
    });
  });
});
