import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Label,
  MultiColumnList,
} from '@folio/stripes/components';

import InvoiceDocument from '../../InvoiceDocument';

const linksVisibleColumns = ['name', 'url'];
const linksColumnMapping = {
  name: <FormattedMessage id="ui-invoice.invoice.link.name" />,
  url: <FormattedMessage id="ui-invoice.invoice.link.url" />,
};
const linksFormatter = {
  url: l => (
    <a
      href={l.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {l.url}
    </a>
  ),
};

const documentsVisibleColumns = ['name'];
const documentsColumnMapping = {
  name: <FormattedMessage id="ui-invoice.invoice.documents.name" />,
};
const documentsFormatter = {
  name: d => (
    <InvoiceDocument
      name={d.name}
      documentId={d.id}
    />
  ),
};

const DocumentsDetails = ({ invoiceDocuments }) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <Label>
            <FormattedMessage id="ui-invoice.invoice.links.title" />
          </Label>

          <MultiColumnList
            contentData={invoiceDocuments.filter(invoiceDocument => invoiceDocument.url)}
            visibleColumns={linksVisibleColumns}
            columnMapping={linksColumnMapping}
            formatter={linksFormatter}
            interactive={false}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Label>
            <FormattedMessage id="ui-invoice.invoice.documents.title" />
          </Label>

          <MultiColumnList
            contentData={invoiceDocuments.filter(invoiceDocument => !invoiceDocument.url)}
            visibleColumns={documentsVisibleColumns}
            columnMapping={documentsColumnMapping}
            formatter={documentsFormatter}
            interactive={false}
          />
        </Col>
      </Row>
    </>
  );
};

DocumentsDetails.propTypes = {
  invoiceDocuments: PropTypes.arrayOf(PropTypes.object),
};

DocumentsDetails.defaultProps = {
  invoiceDocuments: [],
};

export default DocumentsDetails;
