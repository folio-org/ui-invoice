import { renderHook } from '@testing-library/react-hooks';

import { useDefaultAccountingCode } from './useDefaultAccountingCode';
import { useVendors } from '../useVendors';

jest.mock('../useVendors', () => ({
  useVendors: jest.fn(),
}));

const voucherMock = {
  vendorId: 'vendorId',
  accountingCode: 'accountingCode',
  accountNo: 'accountNo',
};

const erpCodeMock = 'erpCode';
const noAccount = 'No-Account';

describe('useDefaultAccountingCode', () => {
  beforeEach(() => {
    useVendors.mockClear().mockReturnValue({
      vendors: [{ erpCode: erpCodeMock }],
      isLoading: false,
    });
  });

  it('should display erpCode', async () => {
    const { result, waitFor } = renderHook(() => useDefaultAccountingCode(voucherMock));

    await waitFor(() => !result.current.isLoading);

    expect(result.current.erpCode).toBe(erpCodeMock);
  });

  it('should display `-` when there is the same accountingCode and vendor erpCode', async () => {
    const { result, waitFor } = renderHook(() => useDefaultAccountingCode({
      ...voucherMock,
      accountingCode: erpCodeMock,
    }));

    await waitFor(() => !result.current.isLoading);

    expect(result.current.accountNo).toBe('-');
  });

  it('should display `No-Account` when there is the same accountingCode and vendor erpCode', async () => {
    const { result, waitFor } = renderHook(() => useDefaultAccountingCode({
      ...voucherMock,
      accountingCode: erpCodeMock,
    }, noAccount));

    await waitFor(() => !result.current.isLoading);

    expect(result.current.accountNo).toBe(noAccount);
  });
});
