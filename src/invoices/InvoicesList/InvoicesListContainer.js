import React, { useCallback, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import {
  organizationsManifest,
  RESULT_COUNT_INCREMENT,
  usePagination,
} from '@folio/stripes-acq-components';
import { useInvoices } from './hooks';

import InvoicesList from './InvoicesList';
import { fetchInvoiceOrganizations } from './utils';

const resetData = () => {};

const InvoicesListContainer = ({ mutator: originMutator }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const {
    pagination,
    changePage,
    refreshPage,
  } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });

  const fetchVendors = useCallback(fetchedInvoices => {
    const organizationsPromise = fetchInvoiceOrganizations(
      mutator.invoicesListOrganizations, fetchedInvoices, {},
    );

    return organizationsPromise
      .then(organizationsResponse => {
        return organizationsResponse.reduce((acc, orgItem) => {
          acc[orgItem.id] = orgItem;

          return acc;
        }, {});
      });
  }, [mutator.invoicesListOrganizations]);

  const {
    invoices,
    invoicesCount,
    isFetching,
    query,
  } = useInvoices({ pagination, fetchVendors });

  return (
    <InvoicesList
      onNeedMoreData={changePage}
      resetData={resetData}
      invoicesCount={invoicesCount}
      isLoading={isFetching}
      invoices={invoices}
      pagination={pagination}
      refreshList={refreshPage}
      query={query}
    />
  );
};

InvoicesListContainer.manifest = Object.freeze({
  invoicesListOrganizations: {
    ...organizationsManifest,
    accumulate: true,
  },
});

InvoicesListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(InvoicesListContainer);
