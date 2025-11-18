import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import DuplicateInvoiceList from '../../../common/components/DuplicateInvoiceList';

const DEFAULT_DUPLICATE_INVOICES = [];

const DuplicateInvoiceModal = ({
  duplicateInvoices = DEFAULT_DUPLICATE_INVOICES,
  onCancel,
  onSubmit,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-invoice.invoice.isNotUnique.confirmation.heading' });

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirm-button
        buttonStyle="primary"
        marginBottom0
        onClick={onSubmit}
      >
        <FormattedMessage id="ui-invoice.button.submit" />
      </Button>

      <Button
        data-test-cancel-button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-invoice.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      aria-label={modalLabel}
      footer={footer}
      id="invoice-is-not-unique-confirmation"
      label={modalLabel}
      open
    >
      <FormattedMessage id="ui-invoice.invoice.isNotUnique.confirmation.message" />
      <hr />
      <DuplicateInvoiceList invoices={duplicateInvoices} />
    </Modal>
  );
};

DuplicateInvoiceModal.propTypes = {
  duplicateInvoices: PropTypes.arrayOf(PropTypes.object),
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DuplicateInvoiceModal;
