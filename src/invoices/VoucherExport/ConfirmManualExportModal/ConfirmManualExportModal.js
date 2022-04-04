import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const ConfirmManualExportModal = ({
  onCancel,
  onConfirm,
  open,
  selectedBatchGroupName,
}) => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'ui-invoice.settings.actions.manualExport.heading' });

  return (
    <ConfirmationModal
      aria-label={label}
      id="run-manual-export-confirmation"
      confirmLabel={<FormattedMessage id="ui-invoice.button.continue" />}
      heading={label}
      message={
        <FormattedMessage
          id="ui-invoice.settings.actions.manualExport.message"
          values={{ selectedBatchGroupName }}
        />
      }
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
    />
  );
};

ConfirmManualExportModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool,
  selectedBatchGroupName: PropTypes.string,
};
