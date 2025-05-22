import { useCallback } from 'react';

import {
  buildArrayFieldQuery,
  buildDateTimeRangeQuery,
  buildDateRangeQuery,
  buildNumberRangeQuery,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { getKeywordQuery } from '../../InvoicesListSearchConfig';
import { FILTERS } from '../../constants';

function getQueryForTags(filterValue) {
  const tagsQuery = buildArrayFieldQuery(FILTERS.TAGS, filterValue);
  const invoiceLineTagsQuery = buildArrayFieldQuery(FILTERS.INVOICE_LINE_TAGS, filterValue);

  return `(${tagsQuery} or ${invoiceLineTagsQuery})`;
}

export const useBuildQuery = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(makeQueryBuilder(
    'cql.allRecords=1',
    (query, qindex) => {
      if (qindex) {
        return `(${qindex}="${query}*")`;
      }

      return `(${getKeywordQuery(query)})`;
    },
    'sortby invoiceDate/sort.descending',
    {
      [FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FILTERS.ACQUISITIONS_UNIT]),
      [FILTERS.DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
      [FILTERS.DATE_UPDATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_UPDATED]),
      [FILTERS.INVOICE_LINE_DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.INVOICE_LINE_DATE_CREATED]),
      [FILTERS.INVOICE_LINE_DATE_UPDATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.INVOICE_LINE_DATE_UPDATED]),
      [FILTERS.INVOICE_DATE]: buildDateRangeQuery.bind(null, [FILTERS.INVOICE_DATE]),
      [FILTERS.PAYMENT_DUE]: buildDateRangeQuery.bind(null, [FILTERS.PAYMENT_DUE]),
      [FILTERS.APPROVAL_DATE]: buildDateTimeRangeQuery.bind(null, [FILTERS.APPROVAL_DATE]),
      [FILTERS.PAYMENT_DATE]: buildDateTimeRangeQuery.bind(null, [FILTERS.PAYMENT_DATE]),
      [FILTERS.TAGS]: getQueryForTags,
      [FILTERS.FUND_CODE]: buildArrayFieldQuery.bind(null, ['invoiceLines.fundDistributions']),
      [FILTERS.EXPENSE_CLASS]: buildArrayFieldQuery.bind(null, ['invoiceLines.fundDistributions']),
      [FILTERS.LOCK_TOTAL]: buildNumberRangeQuery.bind(null, [FILTERS.LOCK_TOTAL]),
      [FILTERS.TOTAL_AMOUNT]: buildNumberRangeQuery.bind(null, [FILTERS.TOTAL_AMOUNT]),
    },
  ), []);
};
