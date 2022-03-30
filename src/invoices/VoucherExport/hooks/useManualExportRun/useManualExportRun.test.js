import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useManualExportRun } from './useManualExportRun';
import { BATCH_VOUCHER_EXPORT_STATUS } from '../../../../common/constants';

const defaultProps = {
  batchGroupId: 'batchGroupId',
  batchGroups: [{ id: 'batchGroupId' }],
  batchVoucherExports: [{ id: 'exportId' }],
  refetch: jest.fn(() => ({
    data: {
      batchVoucherExports: [{ id: 'exportId', status: BATCH_VOUCHER_EXPORT_STATUS.pending }],
    },
  })),
};

const mockPost = jest.fn(() => ({
  json: () => Promise.resolve(defaultProps.batchVoucherExports[0]),
}));

describe('useManualExportRun', () => {
  it('should call \'ky.post\' on manual export run', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      post: mockPost,
    });

    const { result } = renderHook(() => useManualExportRun(defaultProps));
    const [runManualExport, clearTimeout] = result.current;

    runManualExport();
    clearTimeout();

    expect(mockPost).toHaveBeenCalled();
  });
});
