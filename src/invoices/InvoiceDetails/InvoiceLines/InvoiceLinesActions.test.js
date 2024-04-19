import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import InvoiceLinesActions from './InvoiceLinesActions';

jest.mock('./AddInvoiceLinesActionContainer', () => jest.fn(() => 'AddInvoiceLinesActionContainer'));

const defaultProps = {
  isDisabled: false,
  addLines: jest.fn(),
  createLine: jest.fn(),
  invoiceCurrency: 'USD',
  invoiceVendorId: 'invoiceVendorId',
  toggleColumn: jest.fn(),
};
const renderInvoiceLinesActions = (props = defaultProps) => render(
  <InvoiceLinesActions {...props} />,
);

describe('InvoiceLinesActions', () => {
  it('should display create invoice line action', () => {
    renderInvoiceLinesActions();

    expect(screen.getByTestId('add-invoice-line-btn')).toBeInTheDocument();
  });

  it('should display add invoice line action modals when button is pressed', async () => {
    renderInvoiceLinesActions();

    await user.click(screen.getByTestId('add-invoice-line-btn'));

    expect(screen.getByText('AddInvoiceLinesActionContainer')).toBeDefined();
  });

  it('should display create invoice line action', () => {
    renderInvoiceLinesActions();

    expect(screen.getByTestId('create-invoice-line-btn')).toBeInTheDocument();
  });
});
