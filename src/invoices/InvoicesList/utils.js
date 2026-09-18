import {
  omit,
  uniq,
} from 'lodash';
import queryString from 'query-string';

import {
  batchFetch,
} from '@folio/stripes-acq-components';

export const LIST_IGNORED_QUERY_PARAMS = ['layer'];

export const getQueryParams = search => (
  omit(queryString.parse(search), LIST_IGNORED_QUERY_PARAMS)
);

export const fetchInvoiceOrganizations = (mutator, invoices, fetchedOrganizationsMap) => {
  const unfetchedOrganizations = invoices
    .filter(invoice => !fetchedOrganizationsMap[invoice.vendorId])
    .map(invoice => invoice.vendorId);

  return unfetchedOrganizations.length
    ? batchFetch(mutator, uniq(unfetchedOrganizations))
    : Promise.resolve([]);
};
