import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import DuplicateInvoiceList from '../../../common/components/DuplicateInvoiceList';

const DuplicateInvoiceModal = ({ duplicateInvoices, onSubmit, onCancel }) => {
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
      footer={footer}
      id="invoice-is-not-unique-confirmation"
      label={<FormattedMessage id="ui-invoice.invoice.isNotUnique.confirmation.heading" />}
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

DuplicateInvoiceModal.defaultProps = {
  duplicateInvoices: [],
};

export default DuplicateInvoiceModal;
