import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { VoucherExportFooter } from './VoucherExportFooter';

const defaultProps = {
  disabled: false,
  onCancel: jest.fn(),
  runManualExport: jest.fn(),

};

const renderVoucherExportFooter = (props = {}) => render(
  <VoucherExportFooter
    {...defaultProps}
    {...props}
  />,
);

describe('VoucherExportFooter', () => {
  it('should display \'Cancel\' and \'Run manual export\' buttons', () => {
    renderVoucherExportFooter();

    expect(screen.getByText('ui-invoice.button.cancel')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.button.runManualExport')).toBeInTheDocument();
  });

  it('should call \'onCancel\' when \'Cancel\' button was clicked', async () => {
    renderVoucherExportFooter();

    const cancelBtn = screen.getByText('ui-invoice.button.cancel');

    await user.click(cancelBtn);

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call \'runManualExport\' when \'Run manual export\' button was clicked', async () => {
    renderVoucherExportFooter();

    const runExportBtn = screen.getByText('ui-invoice.button.runManualExport');

    await user.click(runExportBtn);

    expect(defaultProps.runManualExport).toHaveBeenCalled();
  });
});
