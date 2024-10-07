import {
  EXPENSE_CLASSES_API,
  FUNDS_API,
} from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  FISCAL_YEARS_API,
} from '../../../common/constants';

export const handleBudgetNotFoundByFundIdAndFiscalYearId = async ({
  action,
  code,
  defaultErrorMessageId,
  error,
  fundMutator,
  ky,
  showCallout,
}) => {
  const errors = error?.errors?.[0]?.parameters;
  let fundId = errors?.find(({ key }) => key === 'fundId')?.value;
  const fiscalYearId = errors?.find(({ key }) => key === 'fiscalYearId')?.value;

  if (!fundId) {
    fundId = errors?.find(({ key }) => key === 'fund')?.value;
  }

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

export const handleInactiveExpenseClass = async ({
  action,
  code,
  defaultErrorMessageId,
  error,
  expenseClassMutator,
  showCallout,
}) => {
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
};
