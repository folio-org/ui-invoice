import {
  TAGS_API,
} from '../constants';
import { BASE_RESOURCE } from './base';

// eslint-disable-next-line import/prefer-default-export
export const tagsResource = {
  ...BASE_RESOURCE,
  path: TAGS_API,
  records: 'tags',
};
