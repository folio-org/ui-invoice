import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesConnect } from '@folio/stripes/core';
import {
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  makeQueryBuilder,
  useList,
} from '@folio/stripes-acq-components';

import {
  invoicesResource,
  VENDORS,
} from '../../common/resources';

import InvoicesList from './InvoicesList';
import {
  getKeywordQuery,
} from './InvoicesListSearchConfig';
import { fetchInvoiceOrganizations } from './utils';
import { FILTERS } from './constants';

const RESULT_COUNT_INCREMENT = 30;

const buildInvoicesQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return `(${getKeywordQuery(query)})`;
  },
  'sortby name/sort.ascending',
  {
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
);

const resetData = () => {};

const InvoicesListContainer = ({ mutator: originMutator, location }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const [organizationsMap, setOrganizationsMap] = useState({});

  const loadInvoices = useCallback(offset => {
    return mutator.invoicesListInvoices.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildInvoicesQuery(queryString.parse(location.search)),
      },
    });
  }, [location.search, mutator.invoicesListInvoices]);

  const loadInvoicesCB = useCallback((setInvoices, invoicesResponse) => {
    const organizationsPromise = fetchInvoiceOrganizations(
      mutator.invoicesListOrganizations, invoicesResponse.invoices, organizationsMap,
    );

    return organizationsPromise
      .then(organizationsResponse => {
        const newOrganizationsMap = {
          ...organizationsMap,
          ...organizationsResponse.reduce((acc, orgItem) => {
            acc[orgItem.id] = orgItem;

            return acc;
          }, {}),
        };

        setOrganizationsMap(newOrganizationsMap);

        setInvoices((prev) => [
          ...prev,
          ...invoicesResponse.invoices.map(invoice => ({
            ...invoice,
            vendor: newOrganizationsMap[invoice.vendorId],
          })),
        ]);
      });
  }, [mutator.invoicesListOrganizations, organizationsMap]);

  const {
    records: invoices,
    recordsCount: invoicesCount,
    isLoading,
    onNeedMoreData,
    refreshList,
  } = useList(true, loadInvoices, loadInvoicesCB, RESULT_COUNT_INCREMENT);

  return (
    <InvoicesList
      onNeedMoreData={onNeedMoreData}
      resetData={resetData}
      invoicesCount={invoicesCount}
      isLoading={isLoading}
      invoices={invoices}
      refreshList={refreshList}
    />
  );
};

InvoicesListContainer.manifest = Object.freeze({
  invoicesListInvoices: {
    ...invoicesResource,
    accumulate: true,
    records: null,
  },
  invoicesListOrganizations: {
    ...VENDORS,
    accumulate: true,
  },
});

InvoicesListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default stripesConnect(InvoicesListContainer);
