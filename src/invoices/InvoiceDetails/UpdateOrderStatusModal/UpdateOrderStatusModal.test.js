import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, waitFor, screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  PO_LINE_PAYMENT_STATUSES,
  PO_LINE_PAYMENT_STATUS_LABELS,
} from '../constants';
import UpdateOrderStatusModal from './UpdateOrderStatusModal';

const defaultProps = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
};

const renderUpdateOrderStatusModal = (props = {}) => render(
  <UpdateOrderStatusModal
    {...defaultProps}
    {...props}
  />,
);

describe('UpdateOrderStatusModal', () => {
  it('should display modal title, message, footer', () => {
    const { getByText } = renderUpdateOrderStatusModal();

    expect(getByText('ui-invoice.invoice.actions.updateOrderStatus.heading')).toBeInTheDocument();
    expect(getByText('ui-invoice.invoice.actions.updateOrderStatus.message')).toBeInTheDocument();
    expect(getByText('ui-invoice.button.submit')).toBeInTheDocument();
    expect(getByText('ui-invoice.button.cancel')).toBeInTheDocument();
  });

  it('should select a different status when a radio button is clicked', async () => {
    renderUpdateOrderStatusModal();

    const radioButtons = screen.getAllByRole('radio');

    expect(radioButtons.length).toBeGreaterThan(1);

    const secondOption = radioButtons[1];

    expect(secondOption.checked).toBe(false);

    await user.click(secondOption);
    expect(secondOption.checked).toBe(true);
  });

  it('should call onConfirm with selected status when submit is clicked', async () => {
    renderUpdateOrderStatusModal();

    const radioButtons = screen.getAllByRole('radio');
    const secondOption = radioButtons[1];

    await user.click(secondOption);

    await waitFor(() => user.click(screen.getByText('ui-invoice.button.submit')));

    expect(defaultProps.onConfirm).toHaveBeenCalledWith(
      PO_LINE_PAYMENT_STATUS_LABELS[PO_LINE_PAYMENT_STATUSES[1]],
    );
  });

  it('should call onCancel when cancel is clicked', async () => {
    renderUpdateOrderStatusModal();

    await waitFor(() => user.click(screen.getByText('ui-invoice.button.cancel')));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
