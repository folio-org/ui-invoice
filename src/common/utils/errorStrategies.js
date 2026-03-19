import { ERROR_CODES } from '../constants';

export const budgetRestrictionsViolationStrategy = ({
  defaultErrorMessageId,
  showCallout,
}) => {
  const handle = (errorsContainer) => {
    const fundCode = errorsContainer.getError().getParameter('fundCode');
    const errorCode = ERROR_CODES[errorsContainer.getError().code];

    if (fundCode) {
      return showCallout({
        messageId: `ui-invoice.errors.${errorCode}`,
        type: 'error',
        values: { fundCode },
      });
    }

    return showCallout({
      messageId: defaultErrorMessageId,
      type: 'error',
    });
  };

  return { handle };
};

export const defaultErrorCodeBasedStrategy = ({
  showCallout,
  values,
}) => {
  const handle = (container) => {
    showCallout({
      messageId: `ui-invoice.errors.${container.getError().code}`,
      type: 'error',
      values,
    });
  };

  return { handle };
};
