import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { batchGroup, batchVoucherExport } from '../../../test/jest/fixtures';
import {
  SCHEDULE_EXPORT,
} from './constants';
import BatchGroupConfigurationForm from './BatchGroupConfigurationForm';

const defaultProps = {
  batchGroups: [batchGroup],
  batchVoucherExports: [batchVoucherExport],
  hasCredsSaved: true,

  initialValues: {
    id: 'exportId',
    enableScheduledExport: true,
    uploadURI: 'https://folio.com',
    scheduleExport: SCHEDULE_EXPORT.weekly,
  },
  onSubmit: jest.fn(),

  testConnection: jest.fn(),
  runManualExport: jest.fn(),
  selectBatchGroup: jest.fn(),
};
const renderBatchGroupConfigurationForm = (props = defaultProps) => render(
  <BatchGroupConfigurationForm {...props} />,
  { wrapper: MemoryRouter },
);

describe('BatchGroupConfigurationForm component', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', () => {
    const { asFragment } = renderBatchGroupConfigurationForm();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Run manuall action', () => {
    it('should open confirmation to export manually', () => {
      renderBatchGroupConfigurationForm();

      user.click(screen.getByText('ui-invoice.button.runManualExport'));

      expect(screen.getByText('ui-invoice.settings.actions.manualExport.heading')).toBeDefined();
    });

    it('should run manual export when modal is confirmed', () => {
      const runManualExport = jest.fn();

      renderBatchGroupConfigurationForm({ ...defaultProps, runManualExport });

      user.click(screen.getByText('ui-invoice.button.runManualExport'));
      user.click(screen.getByText('ui-invoice.button.continue'));

      expect(runManualExport).toHaveBeenCalled();
    });
  });
});
