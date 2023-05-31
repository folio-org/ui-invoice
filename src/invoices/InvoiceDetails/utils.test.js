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
});
