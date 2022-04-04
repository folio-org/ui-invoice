import React from 'react';
import { useHistory } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { useSorting } from '@folio/stripes-acq-components';

import {
  BATCH_VOUCHER_EXPORT_STATUS,
  CONTENT_TYPES,
} from '../../common/constants';
import {
  useBatchGroupExportConfigs,
  useBatchGroups,
  useBatchVoucherExports,
  useManualExportRun,
} from './hooks';

import VoucherExport from './VoucherExport';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
  useLocation: jest.fn().mockReturnValue({}),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useSorting: jest.fn().mockReturnValue(['field', 'ascending', jest.fn()]),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useBatchGroups: jest.fn(),
  useBatchVoucherExports: jest.fn(),
  useBatchGroupExportConfigs: jest.fn(),
  useManualExportRun: jest.fn(),
}));

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderVoucherExport = () => render(
  <VoucherExport />,
  { wrapper },
);

const mockHistory = {
  push: jest.fn(),
};

const mockExportConfigs = {
  isLoading: false,
  exportConfigs: { id: 'exportConfigId', format: CONTENT_TYPES.json },
};

const mockBatchGroups = {
  isLoading: false,
  batchGroups: [
    { id: 'batchGroupId', name: 'batchGroupName' },
    { id: 'batchGroupId2', name: 'batchGroupName2' },
  ],
};

const mockBatchVoucherExports = {
  isLoading: false,
  isFetching: false,
  totalRecords: 1,
  batchVoucherExports: [{
    id: 'batchGroupId',
    start: 'startDate',
    end: 'endDate',
    status: BATCH_VOUCHER_EXPORT_STATUS.generated,
    message: 'message',
    batchVoucherId: 'batchVoucherId',
  }],
};

const mockManualRun = [jest.fn(), jest.fn()];

describe('VoucherExport', () => {
  beforeEach(() => {
    useHistory.mockClear().mockReturnValue(mockHistory);
    mockHistory.push.mockClear();
    useBatchGroupExportConfigs.mockClear().mockReturnValue(mockExportConfigs);
    useBatchGroups.mockClear().mockReturnValue(mockBatchGroups);
    useBatchVoucherExports.mockClear().mockReturnValue(mockBatchVoucherExports);
    useManualExportRun.mockClear().mockReturnValue(mockManualRun);
  });

  it('should disable \'Batch group\' selection when resources are loading', () => {
    useBatchGroups.mockClear().mockReturnValue({
      ...mockBatchGroups,
      isLoading: true,
    });

    renderVoucherExport();

    expect(screen.getByRole(
      'combobox',
      { name: 'ui-invoice.settings.batchGroupConfiguration.batchGroup' },
    )).toBeDisabled();
  });

  it('should render correct structure for voucher export', () => {
    renderVoucherExport();

    expect(screen.getByText('ui-invoice.voucherExport.paneTitle')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.settings.batchGroupConfiguration.batchGroup')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.button.cancel')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.button.runManualExport')).toBeInTheDocument();
  });

  it('should change sorting when sortable list heading was clicked', () => {
    const mockSorting = ['field', 'ascending', jest.fn()];

    useSorting.mockClear().mockReturnValue(mockSorting);
    useBatchGroups.mockClear().mockReturnValue({
      ...mockBatchGroups,
      batchGroups: [mockBatchGroups.batchGroups[0]],
    });

    renderVoucherExport();

    const dateHeading = screen.getByText('ui-invoice.settings.BatchVoucherExports.date');

    user.click(dateHeading);

    expect(mockSorting[2]).toHaveBeenCalled();
  });

  it('should close \'Voucher export\' pane when \'Cancel\' button was clicked', () => {
    renderVoucherExport();

    const cancelBtn = screen.getByText('ui-invoice.button.cancel');

    user.click(cancelBtn);

    expect(mockHistory.push).toHaveBeenCalled();
  });

  describe('ConfirmManualExportModal', () => {
    let selection;

    beforeEach(() => {
      renderVoucherExport();

      selection = screen.getByRole(
        'combobox',
        { name: 'ui-invoice.settings.batchGroupConfiguration.batchGroup' },
      );

      user.selectOptions(selection, mockBatchGroups.batchGroups[0].name);
    });

    describe('when confirmation modal is open', () => {
      beforeEach(() => {
        const runManualExportBtn = screen.getByText('ui-invoice.button.runManualExport');

        user.click(runManualExportBtn);
      });

      it('should open \'Confirm run manual export\' modal when \'Run manual export\' button was clicked', () => {
        expect(screen.getByText('ui-invoice.settings.actions.manualExport.heading')).toBeInTheDocument();
      });

      it('should run manual export when \'Continue\' button was clicked', () => {
        const confirmBtn = screen.getByText('ui-invoice.button.continue');

        user.click(confirmBtn);

        expect(mockManualRun[0]).toHaveBeenCalled();
      });
    });
  });
});
