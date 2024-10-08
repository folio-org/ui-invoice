import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  INVOICE_STATUS,
} from '../../../common/constants';
import { convertToInvoiceLineFields } from '../../utils';
import { ACQ_ERROR_TYPE } from '../constants';
import {
  inactiveExpenseClassStrategy,
  noBudgetForFiscalYearStrategy,
} from './errorHandlers';

export const createInvoiceLineFromPOL = (poLine, invoiceId, vendor) => {
  return {
    invoiceId,
    poLineId: poLine.id,
    invoiceLineStatus: INVOICE_STATUS.open,
    ...convertToInvoiceLineFields(poLine, vendor),
  };
};

export const showUpdateInvoiceError = async ({
  response,
  showCallout,
  action,
  defaultErrorMessageId,
  expenseClassMutator,
  fundMutator,
  messageValues = {},
  ky = {},
}) => {
  const { handler } = await ResponseErrorsContainer.create(response);

  const errorCode = handler.getError().code;
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
      const acqErrorType = handler.getError().getParameter('type');
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
      const fundCodes = handler.getError().getParameter('funds');

      showCallout({ messageId: `ui-invoice.invoice.actions.approve.error.${ERROR_CODES[code]}`, type: 'error', values: { fundCodes } });
      break;
    }
    case ERROR_CODES.incorrectFundDistributionTotal: {
      const invoiceLineNumber = handler.getError().getParameter('invoiceLineNumber');

      showCallout({ messageId: `ui-invoice.invoice.actions.approve.error.${ERROR_CODES[code]}`, type: 'error', values: { invoiceLineNumber } });
      break;
    }
    case ERROR_CODES.budgetExpenseClassNotFound: {
      const fundCode = handler.getError().getParameter('fundCode');
      const expenseClassName = handler.getError().getParameter('expenseClassName');

      showCallout({ messageId: `ui-invoice.invoice.actions.${action}.error.${code}`, type: 'error', values: { fundCode, expenseClassName } });
      break;
    }
    case ERROR_CODES.inactiveExpenseClass: {
      await handler.handle(inactiveExpenseClassStrategy({
        action,
        code,
        defaultErrorMessageId,
        expenseClassMutator,
        showCallout,
      }));

      break;
    }
    case ERROR_CODES.budgetNotFoundByFundId:
    case ERROR_CODES.budgetNotFoundByFundIdAndFiscalYearId: {
      await handler.handle(noBudgetForFiscalYearStrategy({
        action,
        code,
        defaultErrorMessageId,
        fundMutator,
        ky,
        showCallout,
      }));

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
  ky = {},
}) => {
  const errors = responses.filter(({ status }) => status === 'rejected');

  if (!errors.length) {
    return Promise.resolve([]);
  }

  const errorRequests = errors.map(({ reason }, index) => {
    const invoiceLineNumber = requestData[index]?.invoiceLineNumber;

    return showUpdateInvoiceError({
      response: reason,
      showCallout,
      action: 'saveLine',
      defaultErrorMessageId: 'ui-invoice.errors.invoiceLine.duplicate',
      expenseClassMutator: mutator.expenseClass,
      fundMutator: mutator.fund,
      messageValues: { invoiceLineNumber },
      ky,
    });
  });

  return Promise.all(errorRequests);
};

export const handleInvoiceLinesCreation = async ({
  invoiceLines = [],
  invoiceId,
  createInvoiceLines,
  showCallout,
  mutator,
  ky,
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
    invoiceLineStatus: INVOICE_STATUS.open,
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
        ky,
      });

      return ({
        invoiceId,
        invoiceLines: newInvoiceLinesPromise,
      });
    });
};
