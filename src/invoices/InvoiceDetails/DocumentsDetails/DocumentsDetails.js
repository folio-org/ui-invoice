import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Label,
  MultiColumnList,
} from '@folio/stripes/components';

const linksVisibleColumns = ['name', 'url'];
const linksColumnMapping = {
  name: <FormattedMessage id="ui-invoice.invoice.link.name" />,
  url: <FormattedMessage id="ui-invoice.invoice.link.url" />,
};

const documentsVisibleColumns = ['name'];
const documentsColumnMapping = {
  name: <FormattedMessage id="ui-invoice.invoice.documents.name" />,
};

const DocumentsDetails = ({ invoiceDocuments }) => {
  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <Label>
            <FormattedMessage id="ui-invoice.invoice.links.title" />
          </Label>

          <MultiColumnList
            contentData={invoiceDocuments.filter(invoiceDocument => invoiceDocument.url)}
            visibleColumns={linksVisibleColumns}
            columnMapping={linksColumnMapping}
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
          />
        </Col>
      </Row>
    </Fragment>
  );
};

DocumentsDetails.propTypes = {
  invoiceDocuments: PropTypes.arrayOf(PropTypes.object),
};

DocumentsDetails.defaultProps = {
  invoiceDocuments: [],
};

export default DocumentsDetails;
