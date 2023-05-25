import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { batchGroup, batchVoucherExport } from '../../../test/jest/fixtures';
import {
  EXPORT_FORMAT_OPTIONS,
  LOCATION_TYPE_OPTIONS,
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
    format: EXPORT_FORMAT_OPTIONS[0].value,
    uploadURI: 'ftp.amherst-lib.edu',
    uploadDirectory: '/files/invoices',
    ftpFormat: LOCATION_TYPE_OPTIONS[0].value,
    ftpPort: 22,
    scheduleExport: SCHEDULE_EXPORT.daily,
  },
  onSubmit: jest.fn(),
  testConnection: jest.fn(),
  selectBatchGroup: jest.fn(),
};

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  SHOW_SCHEDULED_EXPORT: true,
}));

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

  it('should render scheduled export input', async () => {
    renderBatchGroupConfigurationForm({
      ...defaultProps,
      initialValues: {
        ...defaultProps.initialValues,
        scheduleExport: SCHEDULE_EXPORT.weekly,
      },
    });

    expect(screen.getByText('ui-invoice.settings.batchGroupConfiguration.scheduleExport')).toBeInTheDocument();
  });
  it('should render upload location placeholder', async () => {
    renderBatchGroupConfigurationForm();

    expect(screen.queryByText('ui-invoice.settings.batchGroupConfiguration.uploadLocation.placeholder')).not.toBeInTheDocument();
  });
});
