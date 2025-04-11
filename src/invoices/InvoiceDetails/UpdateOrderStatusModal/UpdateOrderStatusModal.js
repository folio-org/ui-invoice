import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  Row,
  Col,
  RadioButton,
} from '@folio/stripes/components';

import {
  PO_LINE_PAYMENT_STATUS,
  PO_LINE_PAYMENT_STATUSES,
  PO_LINE_PAYMENT_STATUS_LABELS,
} from '../constants';
import styles from '../InvoiceDetails.css';

const UpdateOrderStatusModal = ({
  onCancel,
  onConfirm,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-invoice.invoice.actions.updateOrderStatus.heading' });
  const [polineStatus, setPolineStatus] = useState(PO_LINE_PAYMENT_STATUS_LABELS[PO_LINE_PAYMENT_STATUS.NO_CHANGE]);

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={() => onConfirm(polineStatus)}
      >
        <FormattedMessage id="ui-invoice.button.submit" />
      </Button>

      <Button
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
      id="cancel-invoice-confirmation"
      label={modalLabel}
      open
    >
      <Row>
        <Col xs={12}>
          <FormattedMessage id="ui-invoice.invoice.actions.updateOrderStatus.message" />
        </Col>
        <Col xs={12} className={styles.updateOrderStatusModalBody}>
          {PO_LINE_PAYMENT_STATUSES.map(status => (
            <RadioButton
              name="status"
              label={<FormattedMessage id={`ui-invoice.invoice.actions.updateOrderStatus.status.${status}`} />}
              checked={polineStatus === PO_LINE_PAYMENT_STATUS_LABELS[status]}
              onChange={() => setPolineStatus(PO_LINE_PAYMENT_STATUS_LABELS[status])}
            />
          ))}
        </Col>
      </Row>
    </Modal>
  );
};

UpdateOrderStatusModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default UpdateOrderStatusModal;
