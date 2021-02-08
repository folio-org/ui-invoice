import { find, get } from 'lodash';

import { EXPENSE_CLASSES_API } from '@folio/stripes-acq-components';

import {
  INVOICE_STATUS,
  ERROR_CODES,
} from '../../common/constants';

// eslint-disable-next-line import/prefer-default-export
export const createInvoiceLineFromPOL = (poLine, invoiceId, vendor) => {
  const quantityPhysical = get(poLine, 'cost.quantityPhysical', 0);
  const quantityElectronic = get(poLine, 'cost.quantityElectronic', 0);
  const accountNumber = get(poLine, 'vendorDetail.vendorAccount');
  const optionalProps = {};

  if (accountNumber) {
    const accounts = get(vendor, 'accounts', []);
    const account = find(accounts, { accountNo: accountNumber });
    const accountingCode = get(account, 'appSystemNo') || get(vendor, 'erpCode');

    optionalProps.accountNumber = accountNumber;
    if (accountingCode) {
      optionalProps.accountingCode = accountingCode;
    }
  }

  return {
    invoiceId,
    invoiceLineStatus: INVOICE_STATUS.open,
    description: poLine.titleOrPackage,
    poLineId: poLine.id,
    comment: poLine.poLineDescription,
    fundDistributions: poLine.fundDistribution,
    referenceNumbers: poLine?.vendorDetail?.referenceNumbers,
    subscriptionStart: get(poLine, 'details.subscriptionFrom'),
    subscriptionEnd: get(poLine, 'details.subscriptionTo'),
    quantity: quantityElectronic + quantityPhysical,
    subTotal: poLine?.cost?.poLineEstimatedPrice || 0,
    ...optionalProps,
  };
};

export const showUpdateInvoiceError = async (
  response,
  showCallout,
  action,
  defaultErrorMessageId,
  expenseClassMutator,
) => {
  let error;

  try {
    error = await response.clone().json();
  } catch (parsingException) {
    error = response;
  }

  const errorCode = error?.errors?.[0]?.code;
  const code = ERROR_CODES[errorCode];

  switch (code) {
    case ERROR_CODES.accountingCodeNotPresent:
    case ERROR_CODES.voucherNumberPrefixNotAlpha:
    case ERROR_CODES.fundDistributionsNotPresent:
    case ERROR_CODES.poLineUpdateFailure:
    case ERROR_CODES.fundCannotBePaid:
    case ERROR_CODES.transactionCreationFailure:
    case ERROR_CODES.lockCalculatedTotalsMismatch: {
      showCallout({
        messageId: `ui-invoice.invoice.actions.approve.error.${ERROR_CODES[code]}`,
        type: 'error',
      });
      break;
    }
    case ERROR_CODES.budgetExpenseClassNotFound: {
      const fundCode = error?.errors?.[0]?.parameters?.filter(({ key }) => key === 'fundCode')[0]?.value;
      const expenseClassName = error?.errors[0]?.parameters?.filter(({ key }) => key === 'expenseClassName')[0]?.value;

      showCallout({ messageId: `ui-invoice.invoice.actions.${action}.error.${code}`, type: 'error', values: { fundCode, expenseClassName } });
      break;
    }
    case ERROR_CODES.inactiveExpenseClass: {
      const expenseClassId = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'expenseClassId')?.value;

      if (expenseClassId) {
        expenseClassMutator.GET({ path: `${EXPENSE_CLASSES_API}/${expenseClassId}` })
          .then(({ name }) => {
            const values = { expenseClass: name };

            showCallout({
              messageId: `ui-invoice.invoice.actions.${action}.error.${ERROR_CODES[code]}`,
              type: 'error',
              values,
            });
          });
      } else {
        showCallout({
          messageId: defaultErrorMessageId,
          type: 'error',
        });
      }
      break;
    }
    default: {
      showCallout({ messageId: defaultErrorMessageId, type: 'error' });
    }
  }
};
