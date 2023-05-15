import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, act } from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import { Tags } from '@folio/stripes-acq-components';

import {
  match,
  history,
  location,
  invoice,
  invoiceLine,
} from '../../../test/jest/fixtures';

import { useInvoice, useInvoiceLineMutation } from '../../common/hooks';
import InvoiceLineDetails from './InvoiceLineDetails';
import InvoiceLineDetailsContainer from './InvoiceLineDetailsContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  Tags: jest.fn(() => 'Tags'),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInvoice: jest.fn(),
  useInvoiceLineMutation: jest.fn().mockReturnValue(jest.fn()),
  useVendors: jest.fn().mockReturnValue({ vendors: [], isLoading: false }),
}));
jest.mock('./InvoiceLineDetails', () => jest.fn().mockReturnValue('InvoiceLineDetails'));

const historyMock = {
  ...history,
  push: jest.fn(),
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
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderInvoiceLineDetailsContainer = (props = {}) => render(
  <InvoiceLineDetailsContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

const getMock = jest.fn(() => ({
  json: () => ({}),
}));

describe('InvoiceLineDetailsContainer', () => {
  beforeEach(() => {
    useInvoice.mockClear().mockReturnValue({ isInvoiceLoading: false, invoice: {} });
    useOkapiKy.mockClear().mockReturnValue({
      get: getMock,
    });
  });

  it('should not display InvoiceLineDetails when loading', async () => {
    useInvoice.mockClear().mockReturnValue({ isInvoiceLoading: true });

    renderInvoiceLineDetailsContainer();

    await screen.findByText('Icon');

    expect(screen.queryByText('InvoiceLineDetails')).toBeNull();
  });

  it('should display InvoiceLineDetails when loaded', async () => {
    renderInvoiceLineDetailsContainer();

    await screen.findByText('InvoiceLineDetails');

    expect(screen.getByText('InvoiceLineDetails')).toBeDefined();
  });

  it('should fetch invoice, invoice line and order line when invoice line is connected', async () => {
    renderInvoiceLineDetailsContainer();

    await screen.findByText('InvoiceLineDetails');

    expect(getMock).toHaveBeenCalled();
  });

  describe('Actions', () => {
    const mutationMock = jest.fn().mockReturnValue(Promise.resolve());

    beforeEach(() => {
      historyMock.push.mockClear();
      InvoiceLineDetails.mockClear();
      useInvoiceLineMutation.mockClear().mockReturnValue({ mutateInvoiceLine: mutationMock });
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
      renderInvoiceLineDetailsContainer();

      await screen.findByText('InvoiceLineDetails');

      act(() => {
        InvoiceLineDetails.mock.calls[0][0].deleteInvoiceLine();
      });

      expect(mutationMock.mock.calls[0][0].options.method).toBe('delete');
    });

    it('should mutate the invoice line when updateInvoiceLineTagList action is called', async () => {
      renderInvoiceLineDetailsContainer();

      await screen.findByText('InvoiceLineDetails');

      act(() => {
        InvoiceLineDetails.mock.calls[0][0].tagsToggle();
      });

      Tags.mock.calls[0][0].putMutator();

      expect(mutationMock).toHaveBeenCalled();
    });
  });
});
