import { chunk } from 'lodash';

import {
  batchRequest,
  fetchAllRecords,
} from '@folio/stripes-acq-components';

import { INVOICE_LINE_API } from '../../../../common/constants';

const buildInvoiceLinesQuery = (itemsChunk) => itemsChunk.map(id => `invoiceId==${id}`).join(' or ');

const fetchInvoiceLines = async (ky, searchParams) => {
  const { invoiceLines } = await ky.get(INVOICE_LINE_API, { searchParams }).json();

  return invoiceLines;
};

export const fetchInvoiceLinesExportDataByIds = ({ ky, ids }) => {
  const batchedIds = chunk(ids, 50);

  return batchedIds.reduce((acc, nextBatch) => {
    return acc.then(prevResp => {
      return batchRequest(
        ({ params }) => fetchAllRecords({
          GET: async ({ params: searchParams }) => fetchInvoiceLines(ky, searchParams),
        }, params.query),
        nextBatch,
        buildInvoiceLinesQuery,
      ).then(nextResp => ([...prevResp, ...nextResp]));
    });
  }, Promise.resolve([]));
};
