import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import ExportSettingsModal from './ExportSettingsModal';

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
  });

  describe('selected fields', () => {
    it('should select an option item if it was clicked', async () => {
      renderExportSettingsModal();

      user.click(screen.getAllByRole('radio')[1]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeFalsy();
      expect(radioBtns[1].checked).toBeTruthy();

      const selects = await screen.findAllByRole('textbox');

      user.click(selects[0]);

      const options = await screen.findAllByRole('option');

      user.click(options[0]);

      expect(options[0].getAttribute('aria-selected')).toBeTruthy();
    });
  });

  describe('all fields', () => {
    it('should select all Invoice fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      user.click(screen.getAllByRole('radio')[1]);
      user.click(screen.getAllByRole('radio')[0]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeTruthy();
    });

    it('should select all Invoice lines fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      user.click(screen.getAllByRole('radio')[3]);
      user.click(screen.getAllByRole('radio')[2]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[2].checked).toBeTruthy();
    });
  });

  describe('Close modal', () => {
    it('should close modal when cancel button clicked', () => {
      renderExportSettingsModal();

      user.click(screen.getByText('ui-invoice.exportSettings.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Export', () => {
    it('should exporting when cancel button clicked', () => {
      renderExportSettingsModal();

      user.click(screen.getByText('ui-invoice.exportSettings.export'));

      expect(screen.queryByText('ui-invoice.exportSettings.invoiceFieldsLabel')).toBeNull();
    });
  });
});
