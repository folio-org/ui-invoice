import React from 'react';
import { render, screen, act } from '@testing-library/react';

import {
  batchGroup,
  batchVoucherExport,
} from '../../../test/jest/fixtures';

import {
  SCHEDULE_EXPORT,
} from './constants';
import BatchGroupConfigurationForm from './BatchGroupConfigurationForm';
import BatchGroupConfigurationSettings from './BatchGroupConfigurationSettings';

jest.mock('./BatchGroupConfigurationForm', () => jest.fn().mockReturnValue('BatchGroupConfigurationForm'));

const exportConfig = {
  id: 'exportId',
  enableScheduledExport: true,
  uploadURI: 'https://folio.com',
  scheduleExport: SCHEDULE_EXPORT.daily,
};
const mutatorMock = {
  batchGroups: {
    GET: jest.fn().mockReturnValue(Promise.resolve([batchGroup])),
  },
  batchVoucherExports: {
    GET: jest.fn().mockReturnValue(Promise.resolve({
      totalRecords: 1,
      batchVoucherExports: [batchVoucherExport],
    })),
    POST: jest.fn().mockReturnValue(Promise.resolve(batchVoucherExport)),
  },
  exportConfig: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
    PUT: jest.fn().mockReturnValue(Promise.resolve(exportConfig)),
  },
  exportConfigId: {
    update: jest.fn(),
  },
  testConnection: {
    POST: jest.fn(),
  },
};
const defaultProps = {
  mutator: mutatorMock,
};
const renderBatchGroupConfigurationSettings = (props = defaultProps) => render(
  <BatchGroupConfigurationSettings {...props} />,
);

describe('BatchGroupConfigurationSettings', () => {
  it('should display BatchGroupConfigurationForm when loaded', async () => {
    renderBatchGroupConfigurationSettings();

    await screen.findByText('BatchGroupConfigurationForm');

    expect(screen.getByText('BatchGroupConfigurationForm')).toBeDefined();
  });

  describe('Actions', () => {
    beforeEach(() => {
      BatchGroupConfigurationForm.mockClear();
    });

    it('should make POST request to test connection when testConnection action is called', async () => {
      mutatorMock.testConnection.POST.mockClear().mockImplementation(() => Promise.reject());

      renderBatchGroupConfigurationSettings();

      await screen.findByText('BatchGroupConfigurationForm');

      BatchGroupConfigurationForm.mock.calls[0][0].testConnection();

      expect(mutatorMock.testConnection.POST).toHaveBeenCalled();
    });

    it('should save export config when onSave is called', async () => {
      mutatorMock.exportConfig.PUT.mockClear();

      renderBatchGroupConfigurationSettings();

      await screen.findByText('BatchGroupConfigurationForm');

      await act(async () => {
        await BatchGroupConfigurationForm.mock.calls[0][0].onSubmit(exportConfig);
      });

      expect(mutatorMock.exportConfig.PUT).toHaveBeenCalled();
    });

    it('should create manual export when runManualExport is called', async () => {
      mutatorMock.batchVoucherExports.POST.mockClear();

      renderBatchGroupConfigurationSettings();

      await screen.findByText('BatchGroupConfigurationForm');

      await act(async () => {
        await BatchGroupConfigurationForm.mock.calls[0][0].runManualExport();
      });

      expect(mutatorMock.batchVoucherExports.POST).toHaveBeenCalled();
    });
  });
});
