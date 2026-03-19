import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import {
  ResponseErrorsContainer,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../constants';
import { budgetRestrictionsViolationStrategy } from '../../utils';

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
];

export const useCommonErrorsHandler = () => {
  const showCallout = useShowCallout();
  const intl = useIntl();

  const handle = useCallback(async (response, options = {}) => {
    const { defaultErrorMessageId, ...rest } = options;

    const { handler } = await ResponseErrorsContainer.create(response);
    const strategy = STRATEGY_MATCHERS.find(({ select }) => select(handler))?.strategy;

    const errorCode = ERROR_CODES[handler.getError().code];

    if (strategy) {
      return handler.handle(strategy({
        code: errorCode,
        defaultErrorMessageId,
        showCallout,
        ...rest,
      }));
    }

    const defaultErrorMessage = intl.formatMessage({
      id: `ui-invoice.errors.${errorCode}`,
      defaultMessage: intl.formatMessage({ id: defaultErrorMessageId }),
    });

    return showCallout({
      message: defaultErrorMessage,
      type: 'error',
    });
  }, [intl, showCallout]);

  return { handle };
};
