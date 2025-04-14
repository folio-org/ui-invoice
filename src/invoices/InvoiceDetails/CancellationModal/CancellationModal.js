import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  TextArea,
  Row,
  Col,
} from '@folio/stripes/components';

import styles from './CancellationModal.css';

const CancellationModal = ({
  onCancel,
  onConfirm,
  setCancellationNote,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-invoice.invoice.actions.cancel.heading' });

  const handleChange = useCallback(
    ({ target: { value } }) => (
      setCancellationNote(value)
    ),
    [setCancellationNote],
  );

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onConfirm}
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
      <Row className={styles.message}>
        <Col xs={12}>
          <FormattedMessage id="ui-invoice.invoice.actions.cancel.message" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <TextArea
            rows={5}
            label={<FormattedMessage id="ui-invoice.invoice.cancellationNote" />}
            onChange={handleChange}
          />
        </Col>
      </Row>
    </Modal>
  );
};

CancellationModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  setCancellationNote: PropTypes.func.isRequired,
};

export default CancellationModal;
