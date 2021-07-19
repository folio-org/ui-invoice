import React from 'react';
import { render, screen } from '@testing-library/react';

import { history, location, invoiceLine, invoice } from '../../../../test/jest/fixtures';

import InvoiceLines from './InvoiceLines';
import { InvoiceLinesContainerComponent } from './InvoiceLinesContainer';

jest.mock('./InvoiceLines', () => jest.fn().mockReturnValue('InvoiceLines'));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const defaultProps = {
  invoiceLines: [invoiceLine],
  invoice,
  vendor: {},
  history: historyMock,
  location,
  orderlinesMap: {},
  refreshData: jest.fn(),
};
const renderInvoiceLinesContainer = (props = defaultProps) => render(
  <InvoiceLinesContainerComponent {...props} />,
);

describe('AddInvoiceLinesActionContainer', () => {
  beforeEach(() => {
    InvoiceLines.mockClear();
  });

  it('should display InvoiceLines', () => {
    renderInvoiceLinesContainer();

    expect(screen.getByText('InvoiceLines')).toBeDefined();
  });

  describe('Actions', () => {
    it('should redirect to invoice line details', () => {
      historyMock.push.mockClear();
      renderInvoiceLinesContainer();

      InvoiceLines.mock.calls[0][0].openLineDetails({}, invoiceLine);

      expect(historyMock.push).toHaveBeenCalledWith({
        pathname: `/invoice/view/${invoice.id}/line/${invoiceLine.id}/view`,
        search: location.search,
      });
    });
  });
});
