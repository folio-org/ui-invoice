import React from 'react';
import user from '@testing-library/user-event';
import { render, waitFor, screen } from '@testing-library/react';

import CancellationModal from './CancellationModal';

const defaultProps = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
};

const renderCancellationModal = (props = {}) => render(
  <CancellationModal
    {...defaultProps}
    {...props}
  />,
);

describe('CancellationModal', () => {
  it('should display modal title, message, cancellation note input, footer', () => {
    const { getByText } = renderCancellationModal();

    expect(getByText('ui-invoice.invoice.actions.cancel.heading')).toBeInTheDocument();
    expect(getByText('ui-invoice.invoice.actions.cancel.message')).toBeInTheDocument();
    expect(getByText('ui-invoice.invoice.cancellationNote')).toBeInTheDocument();
    expect(getByText('ui-invoice.button.submit')).toBeInTheDocument();
    expect(getByText('ui-invoice.button.cancel')).toBeInTheDocument();
  });

  it('should change textarea value when typing', async () => {
    const cancellationNote = 'Some cancellation note';
    const { findByRole } = renderCancellationModal();

    const textarea = await findByRole('textbox');

    expect(textarea.value).toBe('');

    await waitFor(() => user.type(textarea, cancellationNote));

    expect(textarea.value).toBe(cancellationNote);
  });

  it('should handle submit', async () => {
    renderCancellationModal();

    await waitFor(() => user.click(screen.getByText('ui-invoice.button.submit')));

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('should handle action cancellation', async () => {
    renderCancellationModal();

    await waitFor(() => user.click(screen.getByText('ui-invoice.button.cancel')));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
