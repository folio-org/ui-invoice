import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useReactToPrint } from 'react-to-print';

import {
  match,
  history,
  location,
  invoice,
  invoiceLine,
  orderLine,
} from '../../../test/jest/fixtures';
import { useInvoiceMutation } from '../../common/hooks';

import { createInvoiceLineFromPOL } from './utils';
import InvoiceDetails from './InvoiceDetails';
import { InvoiceDetailsContainer } from './InvoiceDetailsContainer';

jest.mock('../../common/hooks', () => ({
  useInvoiceMutation: jest.fn().mockReturnValue({}),
}));
jest.mock('./InvoiceDetails', () => jest.fn().mockReturnValue('InvoiceDetails'));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const mutatorMock = {
  invoiceActionsApprovals: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  invoice: {
    GET: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    DELETE: jest.fn().mockReturnValue(Promise.resolve()),
    PUT: jest.fn().mockReturnValue(Promise.resolve()),
  },
  invoiceLines: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ invoiceLines: [invoiceLine] })),
    POST: jest.fn(),
  },
  orderLines: {
    GET: jest.fn().mockReturnValue(Promise.resolve([orderLine])),
  },
  vendor: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ name: 'Amazon' })),
  },
  exportConfigs: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
};
const defaultProps = {
  match: {
    ...match,
    params: {
      id: invoice.id,
    },
  },
  history: historyMock,
  location,
  mutator: mutatorMock,
  refreshList: jest.fn(),
};
const renderInvoiceDetailsContainer = (props = defaultProps) => render(
  <InvoiceDetailsContainer {...props} />,
);

describe('InvoiceDetailsContainer', () => {
  it('should not display InvoiceDetails when loading', async () => {
    renderInvoiceDetailsContainer({
      ...defaultProps,
      match,
    });

    await screen.findByText('Icon');

    expect(screen.queryByText('InvoiceDetails')).toBeNull();
  });

  it('should display InvoiceDetails when loaded', async () => {
    renderInvoiceDetailsContainer();

    await screen.findByText('InvoiceDetails');

    expect(screen.getByText('InvoiceDetails')).toBeDefined();
  });

  describe('Actions', () => {
    beforeEach(() => {
      historyMock.push.mockClear();
      InvoiceDetails.mockClear();
    });

    it('should redirect to invoices list when onClose action is called', async () => {
      renderInvoiceDetailsContainer();

      await screen.findByText('InvoiceDetails');

      InvoiceDetails.mock.calls[0][0].onClose();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe('/invoice');
    });

    it('should redirect to invoice edit form when onEdit action is called', async () => {
      renderInvoiceDetailsContainer();

      await screen.findByText('InvoiceDetails');

      InvoiceDetails.mock.calls[0][0].onEdit();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`/invoice/edit/${invoice.id}`);
    });

    it('should redirect to invoice line create form when createLine action is called', async () => {
      renderInvoiceDetailsContainer();

      await screen.findByText('InvoiceDetails');

      InvoiceDetails.mock.calls[0][0].createLine();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe('url/line/create');
    });

    it(
      'should make POST requests to create invoice lines based on orderLines when addLines action is called',
      async () => {
        const polInvoiceLine = createInvoiceLineFromPOL(orderLine, invoice.id, {});

        mutatorMock.invoiceLines.POST.mockClear();
        renderInvoiceDetailsContainer();

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].addLines([orderLine]);
        });

        expect(mutatorMock.invoiceLines.POST).toHaveBeenCalledWith(polInvoiceLine);
      },
    );

    it('should make PUT request to update invoice when onUpdate action is called', async () => {
      mutatorMock.invoice.PUT.mockClear();
      renderInvoiceDetailsContainer();

      await screen.findByText('InvoiceDetails');

      await act(async () => {
        await InvoiceDetails.mock.calls[0][0].onUpdate();
      });

      expect(mutatorMock.invoice.PUT).toHaveBeenCalled();
    });

    describe('Delete action', () => {
      it('should make DELETE request when deleteInvoice action is called', async () => {
        mutatorMock.invoice.DELETE.mockClear();
        renderInvoiceDetailsContainer();

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].deleteInvoice();
        });

        expect(mutatorMock.invoice.DELETE).toHaveBeenCalled();
      });

      it('should refresh list when invoice has been deleted', async () => {
        const refreshList = jest.fn();

        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].deleteInvoice();
        });

        expect(refreshList).toHaveBeenCalled();
      });

      it('should not refresh list when invoice has not been deleted', async () => {
        const refreshList = jest.fn();

        mutatorMock.invoice.DELETE.mockClear().mockImplementation(() => Promise.reject());
        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].deleteInvoice();
        });

        expect(refreshList).not.toHaveBeenCalled();
      });
    });

    describe('Approve action', () => {
      const mutateInvoice = jest.fn();

      beforeEach(() => {
        useInvoiceMutation.mockClear().mockReturnValue({ mutateInvoice });
        mutateInvoice.mockClear().mockReturnValue(Promise.resolve());
      });

      it('should call mutateInvoice when approveInvoice action is called', async () => {
        renderInvoiceDetailsContainer();

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].approveInvoice();
        });

        expect(mutateInvoice).toHaveBeenCalled();
      });

      it('should refresh list when invoice has been approved', async () => {
        const refreshList = jest.fn();

        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].approveInvoice();
        });

        expect(refreshList).toHaveBeenCalled();
      });

      it('should not refresh list when invoice has not been approved', async () => {
        const refreshList = jest.fn();

        mutateInvoice.mockClear().mockImplementation(() => Promise.reject(new Error({ response: 'Approve error' })));
        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].approveInvoice();
        });

        expect(refreshList).not.toHaveBeenCalled();
      });
    });

    describe('Pay action', () => {
      const mutateInvoice = jest.fn();

      beforeEach(() => {
        useInvoiceMutation.mockClear().mockReturnValue({ mutateInvoice });
        mutateInvoice.mockClear().mockReturnValue(Promise.resolve());
      });

      it('should call mutateInvoice when payInvoice action is called', async () => {
        renderInvoiceDetailsContainer();

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].payInvoice();
        });

        expect(mutateInvoice).toHaveBeenCalled();
      });

      it('should refresh list when invoice has been paid', async () => {
        const refreshList = jest.fn();

        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].payInvoice();
        });

        expect(refreshList).toHaveBeenCalled();
      });

      it('should not refresh list when invoice has not been paid', async () => {
        const refreshList = jest.fn();

        mutateInvoice.mockClear().mockImplementation(() => Promise.reject(new Error({ response: 'Pay error' })));
        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].payInvoice();
        });

        expect(refreshList).not.toHaveBeenCalled();
      });
    });

    describe('Approve Pay action', () => {
      const mutateInvoice = jest.fn();

      beforeEach(() => {
        useInvoiceMutation.mockClear().mockReturnValue({ mutateInvoice });
        mutateInvoice.mockClear().mockReturnValue(Promise.resolve());
      });

      it('should call mutateInvoice when approveAndPayInvoice action is called', async () => {
        renderInvoiceDetailsContainer();

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].approveAndPayInvoice();
        });

        expect(mutateInvoice).toHaveBeenCalled();
      });

      it('should refresh list when invoice has been approved and paid', async () => {
        const refreshList = jest.fn();

        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          await InvoiceDetails.mock.calls[0][0].approveAndPayInvoice();
        });

        expect(refreshList).toHaveBeenCalled();
      });

      it('should not refresh list when invoice has not been approved/paid', async () => {
        const refreshList = jest.fn();

        mutateInvoice.mockClear().mockImplementation(() => Promise.reject(new Error({ response: 'Pay error' })));
        renderInvoiceDetailsContainer({ ...defaultProps, refreshList });

        await screen.findByText('InvoiceDetails');

        await act(async () => {
          try {
            await InvoiceDetails.mock.calls[0][0].approveAndPayInvoice();
          // eslint-disable-next-line no-empty
          } catch (e) {}
        });

        expect(refreshList).not.toHaveBeenCalled();
      });
    });
  });
});
