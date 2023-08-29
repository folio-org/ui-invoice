import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { invoice } from '../../../../test/jest/fixtures';

import InvoiceActions from './InvoiceActions';

const defaultProps = {
  invoice,
  invoiceLinesCount: 1,
  isDeleteDisabled: false,
  isEditDisabled: false,
  isApprovePayAvailable: false,
  onApprove: jest.fn(),
  onApproveAndPay: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  onPay: jest.fn(),
  onPrint: jest.fn(),
  isApprovePayEnabled: true,
};
const renderInvoiceActions = (props = defaultProps) => render(
  <InvoiceActions {...props} />,
);

describe('InvoiceActions', () => {
  it('should display edit action', () => {
    renderInvoiceActions();

    expect(screen.getByTestId('invoice-edit')).toBeDefined();
  });

  it('should display Approve and Pay action when setting is enabled and with approved status', () => {
    renderInvoiceActions({
      ...defaultProps,
      invoice: {
        ...invoice,
        status: 'Approved',
      },
      isApprovePayAvailable: true,
    });

    expect(screen.getByTestId('invoice-approve-pay')).toBeDefined();
  });

  it('should display Approve and Pay action when setting is enabled and not post approved status', () => {
    renderInvoiceActions({
      ...defaultProps,
      isApprovePayAvailable: true,
    });

    expect(screen.getByTestId('invoice-approve-pay')).toBeDefined();
    expect(screen.getByTestId('invoice-approve-pay')).not.toBeDisabled();
  });

  it('should display Approve action when not post approved status', () => {
    renderInvoiceActions();

    expect(screen.getByTestId('invoice-approve')).toBeDefined();
  });

  it('should Approve & Pay button disabled', () => {
    renderInvoiceActions({
      ...defaultProps,
      isApprovePayEnabled: false,
    });
    expect(screen.getByTestId('invoice-approve')).toBeDefined();
    expect(screen.getByTestId('invoice-approve')).toBeDisabled();
  });

  it('should display Pay action when approved status', () => {
    renderInvoiceActions({
      ...defaultProps,
      invoice: {
        ...invoice,
        status: 'Approved',
      },
    });

    expect(screen.getByTestId('invoice-pay')).toBeDefined();
  });

  it('should display Print action when onPrint prop is defined', () => {
    renderInvoiceActions({
      ...defaultProps,
      onPrint: jest.fn(),
    });

    expect(screen.getByTestId('invoice-print')).toBeDefined();
  });
});
