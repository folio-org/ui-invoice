import { get } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getAccountingCodeOptions = (vendor) => {
  const accounts = get(vendor, 'accounts', []).filter(({ appSystemNo }) => Boolean(appSystemNo));
  const options = accounts.map(({ accountNo, appSystemNo }) => ({
    label: `${accountNo} (${appSystemNo})`,
    value: accountNo,
  }));
  const erpCode = get(vendor, 'erpCode');
  const defaultOption = erpCode
    ? [{ label: `Default (${erpCode})`, value: null }]
    : [];

  return [
    ...defaultOption,
    ...options,
  ];
};
