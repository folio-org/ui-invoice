import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { organizationsManifest } from '@folio/stripes-acq-components';

import DuplicateInvoiceList from '../../../common/components/DuplicateInvoiceList';
import { invoicesResource } from '../../../common/resources';
import useDuplicateInvoice from './useDuplicateInvoice';

const ApproveConfirmationModal = ({
  onCancel,
  onConfirm,
  invoice,
  mutator,
}) => {
  const intl = useIntl();
  const [duplicateInvoices] = useDuplicateInvoice(mutator, invoice);
  const modalLabel = intl.formatMessage({ id: 'ui-invoice.invoice.actions.approve.confirmation.heading' });

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirm-button
        buttonStyle="primary"
        disabled={!duplicateInvoices}
        marginBottom0
        onClick={onConfirm}
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
      id="approve-invoice-confirmation"
      label={modalLabel}
      open
    >
      <FormattedMessage id="ui-invoice.invoice.actions.approve.confirmation.message" />

      {duplicateInvoices?.length
        ? (
          <>
            <hr />
            <DuplicateInvoiceList invoices={duplicateInvoices} />
          </>
        )
        : null
      }
    </Modal>
  );
};

ApproveConfirmationModal.manifest = Object.freeze({
  duplicateInvoices: {
    ...invoicesResource,
    fetch: false,
    accumulate: true,
  },
  vendors: {
    ...organizationsManifest,
    fetch: false,
    accumulate: true,
  },
});

ApproveConfirmationModal.propTypes = {
  invoice: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default stripesConnect(ApproveConfirmationModal);
