import {
  EXPENSE_CLASSES_API,
  FUNDS_API,
} from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  FISCAL_YEARS_API,
} from '../../../common/constants';

export const handleBudgetNotFoundByFundIdAndFiscalYearId = ({
  action,
  code,
  defaultErrorMessageId,
  fundMutator,
  ky,
  showCallout,
}) => {
  const handle = async (errorsContainer) => {
    const error = errorsContainer.getError();
    const fundId = error.getParameter('fundId') || error.getParameter('fund');
    const fiscalYearId = error.getParameter('fiscalYearId');

    if (fundId) {
      return fundMutator.GET({ path: `${FUNDS_API}/${fundId}` })
        .then(async ({ fund }) => {
          let fiscalYear = {};

          if (fiscalYearId) {
            try {
              fiscalYear = await ky.get(`${FISCAL_YEARS_API}/${fiscalYearId}`).json();
            } catch {
              fiscalYear = {};
            }
          }

          showCallout({
            messageId: `ui-invoice.invoice.actions.${action}.error.${ERROR_CODES[code]}`,
            type: 'error',
            values: {
              fundCode: fund?.code,
              fiscalYear: fiscalYear?.code,
            },
          });
        }, () => {
          showCallout({
            messageId: defaultErrorMessageId,
            type: 'error',
          });
        });
    } else {
      return showCallout({
        messageId: defaultErrorMessageId,
        type: 'error',
      });
    }
  };

  return { handle };
};

export const handleInactiveExpenseClass = ({
  action,
  code,
  defaultErrorMessageId,
  expenseClassMutator,
  showCallout,
}) => {
  const handle = async (errorsContainer) => {
    const expenseClassId = errorsContainer.getError().getParameter('expenseClassId');
    const expenseClassName = errorsContainer.getError().getParameter('expenseClassName');

    if (expenseClassId || expenseClassName) {
      const expenseClassPromise = expenseClassName
        ? Promise.resolve({ name: expenseClassName })
        : expenseClassMutator.GET({ path: `${EXPENSE_CLASSES_API}/${expenseClassId}` });

      return expenseClassPromise
        .then(({ name }) => {
          const values = { expenseClass: name };

          showCallout({
            messageId: `ui-invoice.invoice.actions.${action}.error.${ERROR_CODES[code]}`,
            type: 'error',
            values,
          });
        });
    } else {
      return showCallout({
        messageId: defaultErrorMessageId,
        type: 'error',
      });
    }
  };

  return { handle };
};
