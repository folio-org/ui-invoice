import React from 'react';
import { render, screen } from '@testing-library/react';

import { invoice } from '../../../../test/jest/fixtures';

import InvoiceActions from './InvoiceActions';

const defaultProps = {
  invoice,
  invoiceLinesCount: 1,
  isDeleteDisabled: false,
  isEditDisabled: false,
  isApprovePayEnabled: false,
  onApprove: jest.fn(),
  onApproveAndPay: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  onPay: jest.fn(),
  onPrint: jest.fn(),
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
      isApprovePayEnabled: true,
    });

    expect(screen.getByTestId('invoice-approve-pay')).toBeDefined();
  });

  it('should display Approve and Pay action when setting is enabled and not post approved status', () => {
    renderInvoiceActions({
      ...defaultProps,
      isApprovePayEnabled: true,
    });

    expect(screen.getByTestId('invoice-approve-pay')).toBeDefined();
  });

  it('should display Approve action when not post approved status', () => {
    renderInvoiceActions();

    expect(screen.getByTestId('invoice-approve')).toBeDefined();
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

  it('should display Print action when onPrint pro[] is defined', () => {
    renderInvoiceActions({
      ...defaultProps,
      onPrint: jest.fn(),
    });

    expect(screen.getByTestId('invoice-print')).toBeDefined();
  });
});
