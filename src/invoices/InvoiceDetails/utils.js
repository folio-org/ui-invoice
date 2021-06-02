import {
  EXPENSE_CLASSES_API,
  FUNDS_API,
} from '@folio/stripes-acq-components';

import {
  INVOICE_STATUS,
  ERROR_CODES,
} from '../../common/constants';
import {
  convertToInvoiceLineFields,
} from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const createInvoiceLineFromPOL = (poLine, invoiceId, vendor) => {
  return {
    invoiceId,
    poLineId: poLine.id,
    invoiceLineStatus: INVOICE_STATUS.open,
    ...convertToInvoiceLineFields(poLine, vendor),
  };
};

export const showUpdateInvoiceError = async (
  response,
  showCallout,
  action,
  defaultErrorMessageId,
  expenseClassMutator,
  fundMutator,
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
    case ERROR_CODES.organizationIsNotVendor:
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
    case ERROR_CODES.budgetNotFoundByFundId: {
      const fundId = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'fund')?.value;

      if (fundId) {
        fundMutator.GET({ path: `${FUNDS_API}/${fundId}` })
          .then(({ fund }) => {
            showCallout({
              messageId: `ui-invoice.invoice.actions.${action}.error.${ERROR_CODES[code]}`,
              type: 'error',
              values: { fundCode: fund?.code },
            });
          }, () => {
            showCallout({
              messageId: defaultErrorMessageId,
              type: 'error',
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
