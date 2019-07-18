import { get, uniq } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getAccountCodes = (vendor) => {
  const vendorCode = get(vendor, 'erpCode');
  const vendorAccountCodes = get(vendor, 'accounts', []).map(account => get(account, 'appSystemNo'));

  return vendor
    ? uniq([vendorCode, ...vendorAccountCodes].filter(Boolean))
    : [];
};
