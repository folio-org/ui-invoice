import { useCallback } from 'react';

import {
  ResponseErrorsContainer,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../constants';
import {
  budgetRestrictionsViolationStrategy,
  defaultErrorCodeBasedStrategy,
} from '../../utils';

// Error handling strategy chain - matches errors against predefined conditions
// and applies the first matching strategy. Order matters as strategies are
// evaluated sequentially.
const STRATEGY_MATCHERS = [
  {
    select: (handler) => {
      return new Set([
        ERROR_CODES.budgetRestrictedEncumbranceError,
        ERROR_CODES.budgetRestrictedExpendituresError,
      ]).has(handler.getError().code);
    },
    strategy: budgetRestrictionsViolationStrategy,
  },
  {
    select: (handler) => handler.getError().code in ERROR_CODES,
    strategy: defaultErrorCodeBasedStrategy,
  },
];

export const useCommonErrorsHandler = () => {
  const showCallout = useShowCallout();

  const handle = useCallback(async (response, options = {}) => {
    const { defaultErrorMessageId, ...rest } = options;

    const { handler } = await ResponseErrorsContainer.create(response);
    const strategy = STRATEGY_MATCHERS.find(({ select }) => select(handler))?.strategy;

    if (strategy) {
      return handler.handle(strategy({
        defaultErrorMessageId,
        showCallout,
        ...rest,
      }));
    }

    return showCallout({
      messageId: defaultErrorMessageId,
      type: 'error',
    });
  }, [showCallout]);

  return { handle };
};
