import { useCallback } from 'react';

import {
  buildArrayFieldQuery,
  buildDateTimeRangeQuery,
  buildDateRangeQuery,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { getKeywordQuery } from '../../InvoicesListSearchConfig';
import { FILTERS } from '../../constants';

export const useBuildQuery = () => {
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
      [FILTERS.INVOICE_DATE]: buildDateRangeQuery.bind(null, [FILTERS.INVOICE_DATE]),
      [FILTERS.PAYMENT_DUE]: buildDateRangeQuery.bind(null, [FILTERS.PAYMENT_DUE]),
      [FILTERS.APPROVAL_DATE]: buildDateTimeRangeQuery.bind(null, [FILTERS.APPROVAL_DATE]),
      [FILTERS.PAYMENT_DATE]: buildDateTimeRangeQuery.bind(null, [FILTERS.PAYMENT_DATE]),
      [FILTERS.TAGS]: (filterValue) => {
        const value = Array.isArray(filterValue) ? filterValue.join('" or "') : filterValue;

        return `(${FILTERS.TAGS}=("${value}") or invoiceLines.tags.tagList=("${value}"))`;
      },
    },
  ), []);
};
