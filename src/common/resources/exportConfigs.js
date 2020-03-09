import { baseManifest } from '@folio/stripes-acq-components';

import {
  EXPORT_CONFIGURATIONS_API,
} from '../constants';

export const exportConfigsResource = {
  ...baseManifest,
  path: EXPORT_CONFIGURATIONS_API,
  records: 'exportConfigs',
  accumulate: true,
  fetch: false,
};

export const credentialsResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
};
