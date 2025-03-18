import { fetchInvoiceLinesExportDataByIds } from './fetchInvoiceLinesExportDataByIds';

describe('fetchInvoiceLinesExportDataByIds', () => {
  it('should not call invoice line api if no ids passed', () => {
    const ky = { get: jest.fn() };

    fetchInvoiceLinesExportDataByIds({ ky, ids: [] });

    expect(ky.get).not.toHaveBeenCalled();
  });
});
