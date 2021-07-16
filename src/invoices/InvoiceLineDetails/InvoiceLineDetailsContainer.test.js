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

import InvoiceLineDetails from './InvoiceLineDetails';
import { InvoiceLineDetailsContainerComponent } from './InvoiceLineDetailsContainer';

jest.mock('./InvoiceLineDetails', () => jest.fn().mockReturnValue('InvoiceLineDetails'));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  TagsPane: jest.fn(() => 'TagsPane'),
}));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const mutatorMock = {
  invoice: {
    GET: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  },
  invoiceLine: {
    GET: jest.fn().mockReturnValue(Promise.resolve(invoiceLine)),
    DELETE: jest.fn().mockReturnValue(Promise.resolve()),
  },
  poLine: {
    GET: jest.fn().mockReturnValue(Promise.resolve(orderLine)),
  },
};
const defaultProps = {
  match: {
    ...match,
    params: {
      id: invoice.id,
      lineId: invoiceLine.id,
    },
  },
  history: historyMock,
  location,
  mutator: mutatorMock,
  refreshList: jest.fn(),
};
const renderInvoiceLineDetailsContainer = (props = defaultProps) => render(
  <InvoiceLineDetailsContainerComponent {...props} />,
);

describe('InvoiceLineDetailsContainer', () => {
  it('should not display InvoiceLineDetails when loading', async () => {
    renderInvoiceLineDetailsContainer({
      ...defaultProps,
      match,
    });

    await screen.findByText('Icon');

    expect(screen.queryByText('InvoiceLineDetails')).toBeNull();
  });

  it('should display InvoiceLineDetails when loaded', async () => {
    renderInvoiceLineDetailsContainer();

    await screen.findByText('InvoiceLineDetails');

    expect(screen.getByText('InvoiceLineDetails')).toBeDefined();
  });

  it('should fetch invoice', async () => {
    renderInvoiceLineDetailsContainer();

    await screen.findByText('InvoiceLineDetails');

    expect(mutatorMock.invoice.GET).toHaveBeenCalled();
  });

  it('should fetch invoice line', async () => {
    renderInvoiceLineDetailsContainer();

    await screen.findByText('InvoiceLineDetails');

    expect(mutatorMock.invoiceLine.GET).toHaveBeenCalled();
  });

  it('should fetch order line when invoice line is connected', async () => {
    renderInvoiceLineDetailsContainer();

    await screen.findByText('InvoiceLineDetails');

    expect(mutatorMock.poLine.GET).toHaveBeenCalled();
  });

  describe('Actions', () => {
    beforeEach(() => {
      historyMock.push.mockClear();
      InvoiceLineDetails.mockClear();
    });

    it('should redirect to invoice details when closeInvoiceLine action is called', async () => {
      renderInvoiceLineDetailsContainer();

      await screen.findByText('InvoiceLineDetails');

      InvoiceLineDetails.mock.calls[0][0].closeInvoiceLine();

      expect(historyMock.push).toHaveBeenCalledWith({
        search: location.search,
        pathname: `/invoice/view/${invoice.id}`,
      });
    });

    it('should redirect to invoice line edit form when goToEditInvoiceLine action is called', async () => {
      renderInvoiceLineDetailsContainer();

      await screen.findByText('InvoiceLineDetails');

      InvoiceLineDetails.mock.calls[0][0].goToEditInvoiceLine();

      expect(historyMock.push).toHaveBeenCalledWith({
        search: location.search,
        pathname: `/invoice/view/${invoice.id}/line/${invoiceLine.id}/edit`,
      });
    });

    it('should make delete request when deleteInvoiceLine action is called', async () => {
      mutatorMock.invoiceLine.DELETE.mockClear();
      renderInvoiceLineDetailsContainer();

      await screen.findByText('InvoiceLineDetails');

      act(() => {
        InvoiceLineDetails.mock.calls[0][0].deleteInvoiceLine();
      })

      expect(mutatorMock.invoiceLine.DELETE).toHaveBeenCalled();
    });
  });
});
