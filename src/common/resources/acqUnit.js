import { ACQUISITIONS_UNITS_API } from '../constants';
import { BASE_RESOURCE } from './base';

// eslint-disable-next-line import/prefer-default-export
export const ACQUISITIONS_UNITS = {
  ...BASE_RESOURCE,
  path: ACQUISITIONS_UNITS_API,
  records: 'acquisitionsUnits',
};
