import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import {
  batchGroup,
  batchVoucher,
  batchVoucherLine,
  invoice,
} from '../../../test/jest/fixtures';

import {
  useBatchGroup,
  useVoucherByInvoiceId,
  useVoucherLines,
} from '../../common/hooks';
import { useVendor } from '../Voucher/VendorAddress/useVendor';

import usePrintData from './usePrintData';

const vendor = { id: 'vendorId', name: 'Amazon' };

jest.mock('../../common/hooks', () => ({
  useVoucherByInvoiceId: jest.fn(),
  useVoucherLines: jest.fn(),
  useBatchGroup: jest.fn(),
}));
jest.mock('../Voucher/VendorAddress/useVendor', () => ({
  useVendor: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePrintData', () => {
  beforeEach(() => {
    useVoucherByInvoiceId.mockClear().mockReturnValue({ voucher: batchVoucher, isVoucherLoading: false });
    useVoucherLines.mockClear().mockReturnValue({ voucherLines: [batchVoucherLine], isVoucherLinesLoading: false });
    useBatchGroup.mockClear().mockReturnValue({ batchGroup, isBatchGroupLoading: false });
    useVendor.mockClear().mockReturnValue({ isLoading: false, vendor });
  });

  it('should get voucher by invoice id', () => {
    renderHook(() => usePrintData(invoice), { wrapper });

    expect(useVoucherByInvoiceId).toHaveBeenCalledWith(invoice.id);
  });

  it('should get voucher lines by voucher id', () => {
    renderHook(() => usePrintData(invoice), { wrapper });

    expect(useVoucherLines).toHaveBeenCalledWith(batchVoucher.id);
  });

  it('should get voucher batch group by voucher group id', () => {
    renderHook(() => usePrintData(invoice), { wrapper });

    expect(useBatchGroup).toHaveBeenCalledWith(batchVoucher.batchGroupId);
  });

  it('should get vendor by voucher vendor id', () => {
    renderHook(() => usePrintData(invoice), { wrapper });

    expect(useVendor).toHaveBeenCalledWith(batchVoucher.vendorId);
  });

  it('should return combined data source object', () => {
    const { result } = renderHook(() => usePrintData(invoice), { wrapper });

    expect(result.current).toEqual({
      isLoading: false,
      dataSource: {
        batchGroup,
        invoice,
        vendor,
        voucher: batchVoucher,
        voucherLines: [batchVoucherLine],
      },
    });
  });
});
