import { ERROR_CODES } from '../../../common/constants';
import {
  handleInvoiceLineErrors,
  handleInvoiceLinesCreation,
  showUpdateInvoiceError,
} from './utils';

const showCallout = jest.fn();
const ky = jest.fn(() => ({ get: jest.fn().mockReturnValue({ json: jest.fn() }) }));
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
    await showUpdateInvoiceError({
      response: undefined,
      showCallout,
      action,
      defaultErrorMessageId,
      expenseClassMutator,
      fundMutator,
      ky,
    });

    expect(showCallout).toHaveBeenCalledWith({ messageId: defaultErrorMessageId, type: 'error', values: {} });
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

    await showUpdateInvoiceError({
      response,
      showCallout,
      action,
      defaultErrorMessageId,
      expenseClassMutator,
      fundMutator,
    });

    await showUpdateInvoiceError({
      response,
      showCallout,
      action,
      defaultErrorMessageId,
      expenseClassMutator,
      fundMutator,
    });

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

    await showUpdateInvoiceError({
      response,
      showCallout,
      action,
      defaultErrorMessageId,
      expenseClassMutator,
      fundMutator,
    });

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

    await showUpdateInvoiceError({
      response,
      showCallout,
      action,
      defaultErrorMessageId,
      expenseClassMutator,
      fundMutator,
    });

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

    await showUpdateInvoiceError({
      response,
      showCallout,
      action,
      defaultErrorMessageId,
      expenseClassMutator,
      fundMutator,
    });

    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-invoice.invoice.actions.approve.error.outdatedFundIdInEncumbrance',
      type: 'error',
    });
  });

  describe('handleInvoiceLinesCreation', () => {
    it('should return empty array invoiceLines if invoiceLines are empty', async () => {
      const invoiceId = 'test-id';
      const result = await handleInvoiceLinesCreation({ invoiceLines: [], invoiceId });

      expect(result.invoiceLines).toEqual([]);
    });

    it('should call createInvoiceLines with invoiceLines', async () => {
      const invoiceId = 'test-id';
      const invoiceLines = [{ id: 'test-id' }];
      const createInvoiceLines = jest.fn().mockResolvedValueOnce([{ status: 'fulfilled' }]);
      const result = await handleInvoiceLinesCreation({
        invoiceLines,
        invoiceId,
        showCallout: jest.fn(),
        createInvoiceLines,
        mutator: {
          expenseClass: jest.fn(),
          fund: jest.fn(),
        },
        ky,
      });

      expect(result.invoiceLines).toEqual([{ status: 'fulfilled' }]);
      expect(createInvoiceLines).toHaveBeenCalled();
    });
  });

  describe('handleInvoiceLineErrors', () => {
    it('should return empty array invoiceLines if invoiceLines are empty', async () => {
      const result = await handleInvoiceLineErrors({ requestData: [], responses: [] });

      expect(result).toEqual([]);
    });

    it('should call showUpdateInvoiceError with reason response', async () => {
      const reason = { response: { id: 'test-id' } };
      const requestData = [{ invoiceLineNumber: 'test-id' }];
      const responses = [{ status: 'rejected', reason }];
      const result = await handleInvoiceLineErrors({
        requestData,
        responses,
        showCallout: jest.fn(),
        mutator: {
          expenseClass: jest.fn(),
          fund: jest.fn(),
        },
        ky,
      });

      expect(result).toEqual([]);
    });
  });

  it.each([
    ['budgetExpenseClassNotFound', 'ui-invoice.invoice.actions.approve.error.budgetExpenseClassNotFound', ['expenseClassName', 'fundCode']],
    ['incorrectFundDistributionTotal', 'ui-invoice.invoice.actions.approve.error.incorrectFundDistributionTotal', ['invoiceLineNumber']],
    ['budgetNotFoundByFundId', 'ui-invoice.invoice.actions.approve.error.budgetNotFoundByFundId', ['fund', 'fundCode']],
    ['budgetNotFoundByFundId', 'defaultErrorMessageId', []],
    ['userHasNoPermission', 'ui-invoice.invoice.actions.error.userHasNoPermission', []],
    ['userNotAMemberOfTheAcq', 'ui-invoice.invoice.actions.error.userNotAMemberOfTheAcq', []],
    ['fundCannotBePaid', 'ui-invoice.invoice.actions.approve.error.fundCannotBePaid', ['funds']],
    ['budgetNotFoundByFundIdAndFiscalYearId', 'ui-invoice.invoice.actions.approve.error.budgetNotFoundByFundIdAndFiscalYearId', ['fundId', 'fiscalYearId']],
  ])('should get %s error message', async (code, messageId, key) => {
    const mockActionName = 'approve';
    const parameters = key.map(k => ({ key: k, value: 'value' }));
    let values = { values: { ...parameters.reduce((acc, { key: k, value }) => ({ ...acc, [k]: value }), {}) } };

    if (code === 'budgetNotFoundByFundId') {
      values = parameters.length ? { values: { fundCode: 'value' } } : {};
    } else if (code === 'fundCannotBePaid') {
      values = { values: { fundCodes: 'value' } };
    } else if (code === 'budgetNotFoundByFundIdAndFiscalYearId') {
      values = { values: { fundCode: 'value', fiscalYear: undefined } };
    } else if (code === 'userNotAMemberOfTheAcq' || code === 'userHasNoPermission') {
      values = {};
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

    await showUpdateInvoiceError({
      response: mockResponse,
      showCallout,
      action: mockActionName,
      defaultErrorMessageId,
      expenseClassMutator,
      fundMutator: mockFundMutator,
      ky,
    });

    expect(showCallout).toHaveBeenCalledWith({
      messageId,
      type: 'error',
      ...values,
    });
  });
});
