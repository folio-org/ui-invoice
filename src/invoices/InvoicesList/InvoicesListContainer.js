import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesConnect } from '@folio/stripes/core';
import {
  buildDateRangeQuery,
  makeQueryBuilder,
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
    [FILTERS.DATE_CREATED]: buildDateRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
    [FILTERS.INVOICE_DATE]: buildDateRangeQuery.bind(null, [FILTERS.INVOICE_DATE]),
    [FILTERS.PAYMENT_DUE]: buildDateRangeQuery.bind(null, [FILTERS.PAYMENT_DUE]),
    [FILTERS.APPROVAL_DATE]: buildDateRangeQuery.bind(null, [FILTERS.APPROVAL_DATE]),
  },
);

const resetData = () => {};

const InvoicesListContainer = ({ mutator: originMutator, location }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const [invoices, setInvoices] = useState([]);
  const [organizationsMap, setOrganizationsMap] = useState({});
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [invoicesOffset, setInvoicesOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadInvoices = useCallback((offset) => {
    setIsLoading(true);

    return mutator.invoicesListInvoices.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildInvoicesQuery(queryString.parse(location.search)),
      },
    })
      .then(invoicesResponse => {
        const organizationsPromise = fetchInvoiceOrganizations(
          mutator.invoicesListOrganizations, invoicesResponse.invoices, organizationsMap,
        );

        return Promise.all([invoicesResponse, organizationsPromise]);
      })
      .then(([invoicesResponse, organizationsResponse]) => {
        if (!offset) setInvoicesCount(invoicesResponse.totalRecords);

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
      })
      .finally(() => setIsLoading(false));
  }, [
    location.search, mutator.invoicesListInvoices, mutator.invoicesListOrganizations, organizationsMap,
  ]);

  const onNeedMoreData = () => {
    const newOffset = invoicesOffset + RESULT_COUNT_INCREMENT;

    loadInvoices(newOffset)
      .then(() => {
        setInvoicesOffset(newOffset);
      });
  };

  const refreshList = useCallback(() => {
    setInvoices([]);
    setInvoicesOffset(0);
    loadInvoices(0);
  }, [loadInvoices]);

  useEffect(
    refreshList,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

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
