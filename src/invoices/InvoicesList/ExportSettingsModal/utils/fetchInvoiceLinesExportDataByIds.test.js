import { INVOICE_LINE_API } from '../../../../common/constants';
import { fetchInvoiceLinesExportDataByIds } from './fetchInvoiceLinesExportDataByIds';

describe('fetchInvoiceLinesExportDataByIds', () => {
  it('should not call invoice line api if no ids passed', () => {
    const ky = { get: jest.fn() };

    fetchInvoiceLinesExportDataByIds({ ky, ids: [] });

    expect(ky.get).not.toHaveBeenCalled();
  });

  it('should fetch invoice lines when IDs are provided', async () => {
    const ky = { get: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({ invoiceLines: [{ id: '1' }] }) }) };

    const ids = ['1', '2', '3'];
    const result = await fetchInvoiceLinesExportDataByIds({ ky, ids });

    expect(ky.get).toHaveBeenCalledWith(INVOICE_LINE_API, expect.any(Object));
    expect(result).toEqual([{ id: '1' }]);
  });
});
