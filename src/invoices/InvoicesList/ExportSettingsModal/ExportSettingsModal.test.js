import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { exportToCsv } from '@folio/stripes/components';

import ExportSettingsModal from './ExportSettingsModal';
import { EXPORT_INVOICE_FIELDS, EXPORT_INVOICE_FIELDS_OPTIONS } from './constants';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: jest.fn(),
}));

const defaultProps = {
  onCancel: jest.fn(),
  query: 'invoiceQuery',
};

const renderExportSettingsModal = (props = {}) => render(
  <ExportSettingsModal
    {...defaultProps}
    {...props}
  />,
);

describe('ExportSettingsModal', () => {
  it('should render Export Settings Modal', () => {
    renderExportSettingsModal();

    expect(screen.getByText('ui-invoice.exportSettings.label')).toBeDefined();
  });
});

describe('ExportSettingsModal actions', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    exportToCsv.mockClear();
  });

  describe('selected fields', () => {
    it('should select an option item if it was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[1]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeFalsy();
      expect(radioBtns[1].checked).toBeTruthy();

      await user.click(screen.getByLabelText('ui-invoice.exportSettings.invoice.selected'));
      await user.click(screen.getAllByText(EXPORT_INVOICE_FIELDS.accountingCode)[0]);

      expect(screen.getByText('1 item selected')).toBeInTheDocument();
    });
  });

  describe('all fields', () => {
    it('should select all Invoice fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[1]);
      await user.click(screen.getAllByRole('radio')[0]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeTruthy();
    });

    it('should select all Invoice lines fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[3]);
      await user.click(screen.getAllByRole('radio')[2]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[2].checked).toBeTruthy();
    });
  });

  describe('Close modal', () => {
    it('should close modal when cancel button clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getByText('ui-invoice.exportSettings.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Export', () => {
    it('should exporting when \'Export\' button clicked', async () => {
      renderExportSettingsModal();

      await user.click(await screen.findByText('ui-invoice.exportSettings.export'));

      expect(exportToCsv).toHaveBeenCalled();
    });
  });
});
