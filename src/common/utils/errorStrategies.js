export const budgetRestrictionsViolationStrategy = ({
  code,
  defaultErrorMessageId,
  showCallout,
}) => {
  const handle = (errorsContainer) => {
    const fundCode = errorsContainer.getError().getParameter('fundCode');

    if (fundCode) {
      return showCallout({
        messageId: `ui-invoice.errors.${code}`,
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
