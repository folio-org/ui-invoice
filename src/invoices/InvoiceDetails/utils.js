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
import { ACQ_ERROR_TYPE } from './constants';

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
  messageValues = {},
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
    case ERROR_CODES.transactionCreationFailure:
    case ERROR_CODES.organizationIsNotVendor:
    case ERROR_CODES.adjustmentFundDistributionsNotPresent:
    case ERROR_CODES.lineFundDistributionsSummaryMismatch:
    case ERROR_CODES.adjustmentFundDistributionsSummaryMismatch:
    case ERROR_CODES.fundsNotFound:
    case ERROR_CODES.externalAccountNoIsMissing:
    case ERROR_CODES.pendingPaymentError:
    case ERROR_CODES.currentFYearNotFound:
    case ERROR_CODES.expenseClassNotFound:
    case ERROR_CODES.organizationIsNotExist:
    case ERROR_CODES.lockCalculatedTotalsMismatch:
    case ERROR_CODES.outdatedFundIdInEncumbrance:
    case ERROR_CODES.multipleFiscalYears: {
      showCallout({
        messageId: `ui-invoice.invoice.actions.approve.error.${ERROR_CODES[code]}`,
        type: 'error',
      });
      break;
    }
    case ERROR_CODES.userHasNoPermission:
    case ERROR_CODES.userNotAMemberOfTheAcq: {
      const acqErrorType = error?.errors?.[0]?.parameters?.filter(({ key }) => key === 'type')[0]?.value;
      const messageId = `ui-invoice.invoice.actions.error.${ERROR_CODES[code]}`;

      if (acqErrorType === ACQ_ERROR_TYPE.order) {
        showCallout({
          messageId: `${messageId}.${ACQ_ERROR_TYPE.order}`,
          type: 'error',
        });
      } else {
        showCallout({
          messageId,
          type: 'error',
        });
      }

      break;
    }
    case ERROR_CODES.fundCannotBePaid: {
      const fundCodes = error?.errors?.[0]?.parameters?.filter(({ key }) => key === 'funds')[0]?.value;

      showCallout({ messageId: `ui-invoice.invoice.actions.approve.error.${ERROR_CODES[code]}`, type: 'error', values: { fundCodes } });
      break;
    }
    case ERROR_CODES.incorrectFundDistributionTotal: {
      const invoiceLineNumber = error?.errors?.[0]?.parameters?.filter(({ key }) => key === 'invoiceLineNumber')[0]?.value;

      showCallout({ messageId: `ui-invoice.invoice.actions.approve.error.${ERROR_CODES[code]}`, type: 'error', values: { invoiceLineNumber } });
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
      const expenseClassName = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'expenseClassName')?.value;

      if (expenseClassId || expenseClassName) {
        const expenseClassPromise = expenseClassName
          ? Promise.resolve({ name: expenseClassName })
          : expenseClassMutator.GET({ path: `${EXPENSE_CLASSES_API}/${expenseClassId}` });

        expenseClassPromise
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
    case ERROR_CODES.budgetNotFoundByFundId:
    case ERROR_CODES.budgetNotFoundByFundIdAndFiscalYearId: {
      const errors = error?.errors?.[0]?.parameters;
      let fundId = errors?.find(({ key }) => key === 'fundId')?.value;

      if (!fundId) {
        fundId = errors?.find(({ key }) => key === 'fund')?.value;
      }

      if (fundId) {
        fundMutator.GET({ path: `${FUNDS_API}/${fundId}` })
          .then(({ fund }) => {
            showCallout({
              messageId: `ui-invoice.invoice.actions.${action}.error.${ERROR_CODES[code]}`,
              type: 'error',
              values: {
                fundCode: fund?.code,
              },
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
      showCallout({
        messageId: defaultErrorMessageId,
        type: 'error',
        values: messageValues,
      });
    }
  }
};

export const handleInvoiceLineErrors = async ({
  mutator = {},
  requestData = [],
  responses = [],
  showCallout,
}) => {
  const errors = responses.filter(({ status }) => status === 'rejected');

  if (!errors.length) {
    return Promise.resolve();
  }

  const errorRequests = errors.map(({ reason }, index) => {
    const invoiceLineNumber = requestData[index]?.invoiceLineNumber;

    return showUpdateInvoiceError(
      reason?.response,
      showCallout,
      'saveLine',
      'ui-invoice.errors.invoiceLine.duplicate',
      mutator.expenseClass,
      mutator.fund,
      { invoiceLineNumber },
    );
  });

  return Promise.all(errorRequests);
};

export const handleInvoiceLinesCreation = async ({
  invoiceLines = [],
  invoiceId,
  createInvoiceLines,
  showCallout,
  mutator,
}) => {
  if (!invoiceLines.length) {
    return {
      invoiceId,
      invoiceLines: [],
    };
  }

  const newInvoiceLinesData = invoiceLines.map(line => ({
    ...line,
    id: undefined,
    metadata: undefined,
    invoiceId,
  }));

  return createInvoiceLines({ invoiceLines: newInvoiceLinesData })
    .then(async (newInvoiceLinesPromise) => {
      await handleInvoiceLineErrors({
        requestData: newInvoiceLinesData,
        responses: newInvoiceLinesPromise,
        showCallout,
        mutator: {
          expenseClass: mutator.expenseClass,
          fund: mutator.fund,
        },
      });

      return ({
        invoiceId,
        newInvoiceLines: newInvoiceLinesPromise,
      });
    });
};
