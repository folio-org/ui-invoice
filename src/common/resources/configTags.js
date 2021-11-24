import { baseManifest, CONFIG_API } from '@folio/stripes-acq-components';

import {
  CONFIG_MODULE_TAGS,
  CONFIG_NAME_TAGS_ENABLED,
} from '../constants';

export const configTags = {
  ...baseManifest,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_TAGS} and configName=${CONFIG_NAME_TAGS_ENABLED})`,
    },
  },
};
