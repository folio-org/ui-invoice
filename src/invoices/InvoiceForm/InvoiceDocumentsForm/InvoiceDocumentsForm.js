import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FieldArray,
  arrayPush,
} from 'redux-form';
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

const MAX_SIZE = 20 * (10 ** 6);

const InvoiceDocumentsForm = ({ dispatch }) => {
  const showCallout = useShowCallout();

  const selectFile = useCallback(
    (file) => {
      if (MAX_SIZE < file.size) {
        showCallout({
          messageId: 'ui-invoice.errors.fileLimit',
          type: 'error',
        });

        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        dispatch(arrayPush('invoiceForm', 'documents', {
          name: file.name,
          data: event.target.result,
        }));
      };

      reader.readAsDataURL(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
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
  dispatch: PropTypes.func.isRequired,
};

export default InvoiceDocumentsForm;
