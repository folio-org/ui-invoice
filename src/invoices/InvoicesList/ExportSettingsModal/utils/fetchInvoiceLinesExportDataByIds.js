import chunk from 'lodash/chunk';

import {
  batchRequest,
  fetchAllRecords,
} from '@folio/stripes-acq-components';

import { fetchInvoiceLines } from '../../../../common/utils';

const buildInvoiceLinesQuery = (itemsChunk) => itemsChunk.map(id => `invoiceId==${id}`).join(' or ');

// This size was chosen to match existing implementations in the stripes-acq-components library — change if necessary
const CHUNK_SIZE = 50;

export const fetchInvoiceLinesExportDataByIds = ({ ky, ids }) => {
  const batchedIds = chunk(ids, CHUNK_SIZE);

  return batchedIds.reduce((acc, nextBatch) => {
    return acc.then(prevResp => {
      return batchRequest(
        ({ params }) => fetchAllRecords({
          GET: async ({ params: searchParams }) => fetchInvoiceLines(ky, { searchParams }),
        }, params.query),
        nextBatch,
        buildInvoiceLinesQuery,
      ).then(nextResp => ([...prevResp, ...nextResp]));
    });
  }, Promise.resolve([]));
};
