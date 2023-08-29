import { QueryClient, QueryClientProvider } from 'react-query';

import { render, screen, act } from '@folio/jest-config-stripes/testing-library/react';

import {
  batchGroup,
} from '../../../test/jest/fixtures';

import { useBatchGroups } from '../../invoices/VoucherExport/hooks';
import {
  SCHEDULE_EXPORT,
} from './constants';
import BatchGroupConfigurationForm from './BatchGroupConfigurationForm';
import BatchGroupConfigurationSettings from './BatchGroupConfigurationSettings';

jest.mock('../../invoices/VoucherExport/hooks', () => ({
  ...jest.requireActual('../../invoices/VoucherExport/hooks'),
  useBatchGroups: jest.fn().mockReturnValue(),
}));
jest.mock('./BatchGroupConfigurationForm', () => jest.fn().mockReturnValue('BatchGroupConfigurationForm'));

const exportConfig = {
  id: 'exportId',
  enableScheduledExport: true,
  uploadURI: 'https://folio.com',
  scheduleExport: SCHEDULE_EXPORT.daily,
};
const mutatorMock = {
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

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderBatchGroupConfigurationSettings = (props = defaultProps) => render(
  <BatchGroupConfigurationSettings {...props} />,
  { wrapper },
);

describe('BatchGroupConfigurationSettings', () => {
  beforeEach(() => {
    useBatchGroups.mockClear().mockReturnValue({
      batchGroups: [batchGroup],
      isLoading: false,
    });
  });

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
  });
});
