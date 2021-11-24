import { get } from 'lodash';

import {
  baseManifest,
  VENDORS_API,
} from '@folio/stripes-acq-components';

export const VENDOR = {
  ...baseManifest,
  path: (queryParams, pathComponents, resourceData, logger, props) => {
    const vendorId = get(props, ['resources', 'invoice', 'records', 0, 'vendorId']);

    return vendorId ? `${VENDORS_API}/${vendorId}` : null;
  },
};
