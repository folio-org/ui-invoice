import { INVOICE_LINE_API } from '../../constants';
import { fetchInvoiceLines } from './fetchInvoiceLines';

describe('fetchInvoiceLines', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch invoice lines successfully', async () => {
    const kyMock = {
      get: jest.fn(() => ({
        json: () => ({ invoiceLines: [] }),
      })),
    };

    const options = { query: '', offset: 0 };

    fetchInvoiceLines(kyMock, options);

    expect(kyMock.get).toHaveBeenCalledWith(INVOICE_LINE_API, options);
  });
});
