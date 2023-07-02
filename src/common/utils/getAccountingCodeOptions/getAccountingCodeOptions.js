import { get } from 'lodash';

export const NO_ACCOUNT_NUMBER = '__NO_ACCOUNT_NUMBER__';

/**
 * Each option in the "Accounting code" selection is intended for two fields of the invoice: `accountNo` and `accountingCode` itself.
 *
 * Possible options are vendor accounts that have the specified "Accounting code" value (`appSystemNo` field in an organization's account).
 * In addition, a vendor might have an "Accounting code" value at the level of the entire organization (`erpCode`), which will be the default option for the accounting code.
 * Still, there is no corresponding account number value for it.
 *
 * The option's value is the account number, since it is unique for each vendor account (unlike the accounting code)
 * and allows to determine the corresponding accounting code value for the account.
 *
 * Since the default accounting code does not have an associated account number,
 * "NO_ACCOUNT_NUMBER" is used as the value for this option to be displayed correctly (to distinguish it from an empty option with a value of `null`).
 */
export const getAccountingCodeOptions = (vendor) => {
  const accounts = get(vendor, 'accounts', []).filter(({ appSystemNo }) => Boolean(appSystemNo));
  const options = accounts.map(({ accountNo, appSystemNo }) => ({
    label: `${accountNo} (${appSystemNo})`,
    value: accountNo,
  }));
  const erpCode = get(vendor, 'erpCode');
  const defaultOption = erpCode
    ? [{ label: `Default (${erpCode})`, value: NO_ACCOUNT_NUMBER }]
    : [];

  return [
    ...defaultOption,
    ...options,
  ];
};
