import React, { useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  TextArea,
  Row,
  Col,
} from '@folio/stripes/components';

const CancellationModal = ({
  onCancel,
  onConfirm,
}) => {
  const [cancellationNote, setCancellationNote] = useState('');

  const handleChange = useCallback(
    ({ target: { value } }) => (
      setCancellationNote(value)
    ),
    [],
  );

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirm-button
        buttonStyle="primary"
        marginBottom0
        onClick={() => onConfirm(cancellationNote)}
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
      id="cancel-invoice-confirmation"
      label={<FormattedMessage id="ui-invoice.invoice.actions.cancel.heading" />}
      open
    >
      <Row>
        <Col xs={12}>
          <div
            style={{ marginBottom: 12 }}
          >
            <FormattedMessage id="ui-invoice.invoice.actions.cancel.message" />
          </div>
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
};

export default CancellationModal;
