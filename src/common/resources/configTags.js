import {
  CONFIG_API,
  CONFIG_MODULE_TAGS,
  CONFIG_NAME_TAGS_ENABLED,
} from '../constants';
import { BASE_RESOURCE } from './base';

// eslint-disable-next-line import/prefer-default-export
export const configTags = {
  ...BASE_RESOURCE,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      query: `(module=${CONFIG_MODULE_TAGS} and configName=${CONFIG_NAME_TAGS_ENABLED})`,
    },
  },
};
