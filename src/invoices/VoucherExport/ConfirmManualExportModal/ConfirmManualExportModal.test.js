import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { ConfirmManualExportModal } from './ConfirmManualExportModal';

const defaultProps = {
  open: true,
  selectedBatchGroupName: 'Batch group',
  onCancel: jest.fn(),
  onConfirm: jest.fn(),

};

const renderConfirmManualExportModal = (props = {}) => render(
  <ConfirmManualExportModal
    {...defaultProps}
    {...props}
  />,
);

describe('ConfirmManualExportModal', () => {
  it('should display confirmation modal with heading and message', () => {
    renderConfirmManualExportModal();

    expect(screen.getByText('ui-invoice.settings.actions.manualExport.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.settings.actions.manualExport.message')).toBeInTheDocument();
  });

  it('should call \'onCancel\' when \'Cancel\' button was clicked', () => {
    renderConfirmManualExportModal();

    const cancelBtn = screen.getByText('stripes-components.cancel');

    user.click(cancelBtn);

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call \'onConfirm\' when \'Continue\' button was clicked', () => {
    renderConfirmManualExportModal();

    const confirmBtn = screen.getByText('ui-invoice.button.continue');

    user.click(confirmBtn);

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
