import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom/withRouter';

import { stripesConnect } from '@folio/stripes/core';
import { downloadBase64 } from '@folio/stripes-acq-components';

import { invoiceDocumentFromPropsResource } from '../../common/resources';

import InvoiceDocument from './InvoiceDocument';

const InvoiceDocumentContainer = ({ mutator, documentId, name }) => {
  const downloadDocument = useCallback(
    () => {
      mutator.invoiceDocumentDetails.GET()
        .then(invoiceDocumentData => {
          downloadBase64(name, invoiceDocumentData.contents.data);
        });
    },
    [name, mutator.invoiceDocumentDetails],
  );

  return (
    <InvoiceDocument
      name={name}
      downloadDocument={documentId && downloadDocument}
    />
  );
};

InvoiceDocumentContainer.manifest = Object.freeze({
  invoiceDocumentDetails: {
    ...invoiceDocumentFromPropsResource,
    accumulate: true,
    fetch: false,
  },
});

InvoiceDocumentContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  documentId: PropTypes.string,
};

InvoiceDocumentContainer.defaultProps = {
  documentId: '',
};

export default withRouter(stripesConnect(InvoiceDocumentContainer));
