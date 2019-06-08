import { LIMIT_MAX } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const BASE_RESOURCE = {
  perRequest: LIMIT_MAX,
  throwErrors: false,
  type: 'okapi',
};
