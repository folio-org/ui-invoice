import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Label,
} from '@folio/stripes/components';
import {
  FileUploader,
  useShowCallout,
} from '@folio/stripes-acq-components';

import InvoiceDocumentFields from './InvoiceDocumentFields';

const MAX_SIZE_MB = 5;
const MAX_SIZE = MAX_SIZE_MB * (10 ** 6);

const InvoiceDocumentsForm = ({ push }) => {
  const showCallout = useShowCallout();

  const selectFile = useCallback(
    (file) => {
      if (MAX_SIZE < file.size) {
        showCallout({
          messageId: 'ui-invoice.errors.fileLimit',
          type: 'error',
          values: { size: MAX_SIZE_MB },
        });

        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        push('documents', {
          name: file.name,
          data: event.target.result,
        });
      };

      reader.readAsDataURL(file);
    },
    [push, showCallout],
  );

  return (
    <Row>
      <Col xs={4}>
        <Label>
          <FormattedMessage id="ui-invoice.invoice.documents.title" />
        </Label>

        <FieldArray
          component={InvoiceDocumentFields}
          name="documents"
        />
      </Col>

      <Col xs={8}>
        <FileUploader
          onSelectFile={selectFile}
        />
      </Col>
    </Row>
  );
};

InvoiceDocumentsForm.propTypes = {
  push: PropTypes.func.isRequired,
};

export default InvoiceDocumentsForm;
