import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const CurrencyMismatchModal = ({
  onCancel,
  onConfirm,
  open,
}) => {
  return (
    <ConfirmationModal
      id="invoice-line-currency-confirmation"
      confirmLabel={<FormattedMessage id="ui-invoice.invoice.actions.addLine.confirmLabel" />}
      heading={<FormattedMessage id="ui-invoice.invoice.actions.addLine.heading" />}
      message={<FormattedMessage id="ui-invoice.invoice.actions.addLine.currencyMessage" />}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
    />
  );
};

CurrencyMismatchModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
