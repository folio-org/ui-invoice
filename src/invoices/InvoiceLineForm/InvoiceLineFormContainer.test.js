import { useReactToPrint } from 'react-to-print';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  match,
  invoice,
  invoiceLine,
} from '../../../test/jest/fixtures';

import { showUpdateInvoiceError } from '../InvoiceDetails/utils';
import InvoiceLineForm from './InvoiceLineForm';
import { InvoiceLineFormContainerComponent } from './InvoiceLineFormContainer';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn().mockReturnValue({}),
}));
jest.mock('./InvoiceLineForm', () => jest.fn().mockReturnValue('InvoiceLineForm'));
jest.mock('../InvoiceDetails/utils', () => ({
  ...jest.requireActual('../InvoiceDetails/utils'),
  showUpdateInvoiceError: jest.fn(),
}));

const mutatorMock = {
  invoice: {
    GET: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  },
  vendor: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ name: 'Amazon' })),
  },
  invoiceLine: {
    GET: jest.fn().mockReturnValue(Promise.resolve(invoiceLine)),
    POST: jest.fn().mockReturnValue(Promise.resolve()),
    PUT: jest.fn().mockReturnValue(Promise.resolve()),
  },
};
const resources = {};
const defaultProps = {
  match,
  mutator: mutatorMock,
  resources,
  onClose: jest.fn(),
  showCallout: jest.fn(),
};
const renderInvoiceLineFormContainer = (props = defaultProps) => render(
  <InvoiceLineFormContainerComponent {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLineFormContainer', () => {
  it('should not display InvoiceLineForm when loading', () => {
    renderInvoiceLineFormContainer();

    expect(screen.queryByText('InvoiceLineForm')).toBeNull();
  });

  it('should display InvoiceLineForm when loaded', async () => {
    renderInvoiceLineFormContainer();

    await screen.findByText('InvoiceLineForm');

    expect(screen.getByText('InvoiceLineForm')).toBeDefined();
  });

  it('should fetch invoice', async () => {
    mutatorMock.invoice.GET.mockClear();

    renderInvoiceLineFormContainer();

    await screen.findByText('InvoiceLineForm');

    expect(mutatorMock.invoice.GET).toHaveBeenCalled();
  });

  it('should fetch invoice line in edit mode', async () => {
    mutatorMock.invoiceLine.GET.mockClear();

    renderInvoiceLineFormContainer({
      ...defaultProps,
      match: {
        ...match,
        params: { id: 'invoiceId', lineId: 'invoiceLineId' },
      },
    });

    await screen.findByText('InvoiceLineForm');

    expect(mutatorMock.invoiceLine.GET).toHaveBeenCalled();
  });

  describe('Save', () => {
    beforeEach(() => {
      InvoiceLineForm.mockClear();
    });

    it('should make POST request to create invoice line', async () => {
      mutatorMock.invoiceLine.POST.mockClear();

      renderInvoiceLineFormContainer();

      await screen.findByText('InvoiceLineForm');
      await InvoiceLineForm.mock.calls[0][0].onSubmit({ ...invoiceLine, id: null });

      expect(mutatorMock.invoiceLine.POST).toHaveBeenCalled();
    });

    it('should make PUT request to update invoice line', async () => {
      mutatorMock.invoiceLine.PUT.mockClear();

      renderInvoiceLineFormContainer();

      await screen.findByText('InvoiceLineForm');
      await InvoiceLineForm.mock.calls[0][0].onSubmit(invoiceLine);

      expect(mutatorMock.invoiceLine.PUT).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      mutatorMock.invoiceLine.POST.mockClear().mockImplementation(() => Promise.reject());

      renderInvoiceLineFormContainer();

      await screen.findByText('InvoiceLineForm');
      await InvoiceLineForm.mock.calls[0][0].onSubmit({ ...invoiceLine, id: null });

      expect(showUpdateInvoiceError).toHaveBeenCalled();
    });
  });
});
