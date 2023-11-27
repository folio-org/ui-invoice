import { ERROR_CODES } from '../../common/constants';
import { showUpdateInvoiceError } from './utils';

const showCallout = jest.fn();
const action = 'action';
const defaultErrorMessageId = 'defaultErrorMessageId';
const expenseClassMutator = { GET: jest.fn() };
const fundMutator = { GET: jest.fn() };

describe('showUpdateInvoiceError', () => {
  let response;

  beforeEach(() => {
    showCallout.mockClear();
    expenseClassMutator.GET.mockClear();
    fundMutator.GET.mockClear();
  });

  it('should return default error message', async () => {
    await showUpdateInvoiceError(
      undefined, showCallout, action, defaultErrorMessageId, expenseClassMutator, fundMutator,
    );

    expect(showCallout).toHaveBeenCalledWith({ messageId: defaultErrorMessageId, type: 'error' });
  });

  it('should return inactiveExpenseClass default error message', async () => {
    response = {
      clone: () => ({
        json: () => ({
          errors: [{
            code: ERROR_CODES.inactiveExpenseClass,
          }],
        }),
      }),
    };

    await showUpdateInvoiceError(
      response, showCallout, action, defaultErrorMessageId, expenseClassMutator, fundMutator,
    );

    expect(showCallout).toHaveBeenCalledWith({ messageId: defaultErrorMessageId, type: 'error' });
  });

  it('should get expense class by id and return inactiveExpenseClass error message', async () => {
    expenseClassMutator.GET.mockClear().mockResolvedValueOnce({ name: 'expClass' });
    response = {
      clone: () => ({
        json: () => ({
          errors: [{
            code: ERROR_CODES.inactiveExpenseClass,
            parameters: [{
              key: 'expenseClassId',
              value: 'value',
            }],
          }],
        }),
      }),
    };

    await showUpdateInvoiceError(
      response, showCallout, action, defaultErrorMessageId, expenseClassMutator, fundMutator,
    );

    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-invoice.invoice.actions.action.error.inactiveExpenseClass',
      type: 'error',
      values: { expenseClass: 'expClass' },
    });
  });

  it('should get expense class name from response and return inactiveExpenseClass error message', async () => {
    response = {
      clone: () => ({
        json: () => ({
          errors: [{
            code: ERROR_CODES.inactiveExpenseClass,
            parameters: [{
              key: 'expenseClassName',
              value: 'expClass',
            }],
          }],
        }),
      }),
    };

    await showUpdateInvoiceError(
      response, showCallout, action, defaultErrorMessageId, expenseClassMutator, fundMutator,
    );

    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-invoice.invoice.actions.action.error.inactiveExpenseClass',
      type: 'error',
      values: { expenseClass: 'expClass' },
    });
  });

  it('should error message for outdatedFundIdInEncumbrance', async () => {
    response = {
      clone: () => ({
        json: () => ({
          errors: [{
            code: ERROR_CODES.outdatedFundIdInEncumbrance,
          }],
        }),
      }),
    };

    await showUpdateInvoiceError(
      response, showCallout, action, defaultErrorMessageId, expenseClassMutator, fundMutator,
    );

    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-invoice.invoice.actions.approve.error.outdatedFundIdInEncumbrance',
      type: 'error',
    });
  });

  it.each([
    ['budgetExpenseClassNotFound', 'ui-invoice.invoice.actions.approve.error.budgetExpenseClassNotFound', ['expenseClassName', 'fundCode']],
    ['incorrectFundDistributionTotal', 'ui-invoice.invoice.actions.approve.error.incorrectFundDistributionTotal', ['invoiceLineNumber']],
    ['budgetNotFoundByFundId', 'ui-invoice.invoice.actions.approve.error.budgetNotFoundByFundId', ['fund', 'fundCode']],
    ['budgetNotFoundByFundId', 'defaultErrorMessageId', []],
    ['fundCannotBePaid', 'ui-invoice.invoice.actions.approve.error.fundCannotBePaid', ['funds']],
    ['budgetNotFoundByFundIdAndFiscalYearId', 'ui-invoice.invoice.actions.approve.error.budgetNotFoundByFundIdAndFiscalYearId', ['fundId']],
  ])('should get %s error message', async (code, messageId, key) => {
    const mockActionName = 'approve';
    const parameters = key.map(k => ({ key: k, value: 'value' }));
    let values = { values: { ...parameters.reduce((acc, { key: k, value }) => ({ ...acc, [k]: value }), {}) } };

    if (code === 'budgetNotFoundByFundId') {
      values = parameters.length ? { values: { fundCode: 'value' } } : {};
    } else if (code === 'fundCannotBePaid') {
      values = { values: { fundCodes: 'value' } };
    } else if (code === 'budgetNotFoundByFundIdAndFiscalYearId') {
      values = { values: { fundCode: 'value' } };
    }

    const mockResponse = {
      clone: () => ({
        json: () => Promise.resolve(
          ({
            errors: [{
              code: ERROR_CODES[code],
              parameters,
            }],
          }),
        ),
      }),
    };

    const mockFundMutator = {
      GET: jest.fn().mockResolvedValue({ fund: { code: 'value' } }),
    };

    await showUpdateInvoiceError(
      mockResponse, showCallout, mockActionName, defaultErrorMessageId, expenseClassMutator, mockFundMutator,
    );

    expect(showCallout).toHaveBeenCalledWith({
      messageId,
      type: 'error',
      ...values,
    });
  });
});
