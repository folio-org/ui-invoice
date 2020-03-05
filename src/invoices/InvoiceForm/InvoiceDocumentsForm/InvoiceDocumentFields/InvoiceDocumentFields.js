import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  IconButton,
  Row,
} from '@folio/stripes/components';

import InvoiceDocument from '../../../InvoiceDocument';

import css from './InvoiceDocumentFields.css';

const InvoiceDocumentFields = ({ fields }) => (
  <>
    {
      fields.map((elem, index) => {
        const invoiceDocument = fields.get(index);
        const contentClassName = `${css.invoiceDocumentFieldContent} ${
          index % 2 ?
            css.invoiceDocumentFieldContentOdd :
            css.invoiceDocumentFieldContentEven
        }`;

        return (
          <Row
            data-test-invoice-form-document
            key={invoiceDocument.id || index}
          >
            <Col xs={12}>
              <div className={css.invoiceDocumentField}>
                <div
                  className={contentClassName}
                >
                  <InvoiceDocument
                    name={invoiceDocument.name}
                    documentId={invoiceDocument.id}
                  />
                </div>

                <IconButton
                  data-test-remove-document-button
                  icon="trash"
                  onClick={() => fields.remove(index)}
                >
                  <FormattedMessage id="ui-invoice.button.remove" />
                </IconButton>
              </div>
            </Col>
          </Row>
        );
      })
    }
  </>
);

InvoiceDocumentFields.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default InvoiceDocumentFields;
