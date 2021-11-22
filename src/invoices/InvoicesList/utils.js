import { uniq } from 'lodash';

import {
  batchFetch,
} from '@folio/stripes-acq-components';

export const fetchInvoiceOrganizations = (mutator, invoices, fetchedOrganizationsMap) => {
  const unfetchedOrganizations = invoices
    .filter(invoice => !fetchedOrganizationsMap[invoice.vendorId])
    .map(invoice => invoice.vendorId);

  return unfetchedOrganizations.length
    ? batchFetch(mutator, uniq(unfetchedOrganizations))
    : Promise.resolve([]);
};
