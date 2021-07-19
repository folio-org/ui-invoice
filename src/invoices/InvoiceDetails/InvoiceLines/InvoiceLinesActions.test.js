import React from 'react';
import { render, screen } from '@testing-library/react';

import InvoiceLinesActions from './InvoiceLinesActions';

jest.mock('./AddInvoiceLinesActionContainer', () => jest.fn(() => 'AddInvoiceLinesActionContainer'));

const defaultProps = {
  isDisabled: false,
  addLines: jest.fn(),
  createLine: jest.fn(),
  invoiceCurrency: 'USD',
  invoiceVendorId: 'invoiceVendorId',
};
const renderInvoiceLinesActions = (props = defaultProps) => render(
  <InvoiceLinesActions {...props} />,
);

describe('InvoiceLinesActions', () => {
  it('should display add invoice line action', () => {
    renderInvoiceLinesActions();

    expect(screen.getByText('AddInvoiceLinesActionContainer')).toBeDefined();
  });

  it('should display create invoice line action', () => {
    renderInvoiceLinesActions();

    expect(screen.getByText('ui-invoice.button.createLine')).toBeDefined();
  });
});
