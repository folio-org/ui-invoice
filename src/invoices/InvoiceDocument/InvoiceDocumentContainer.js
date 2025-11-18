import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import { downloadBase64 } from '@folio/stripes-acq-components';

import { invoiceDocumentFromPropsResource } from '../../common/resources';

import InvoiceDocument from './InvoiceDocument';

const InvoiceDocumentContainer = ({
  documentId = '',
  mutator,
  name,
}) => {
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
      downloadDocument={documentId ? downloadDocument : undefined}
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
  documentId: PropTypes.string,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default withRouter(stripesConnect(InvoiceDocumentContainer));
