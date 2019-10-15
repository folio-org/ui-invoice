import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { invoiceDocumentsResource } from '../../../common/resources';
import DocumentsDetails from './DocumentsDetails';

const DocumentsDetailsContainer = ({ resources }) => {
  const invoiceDocuments = get(resources, 'invoiceDocumentsDetails.records', []);

  return <DocumentsDetails invoiceDocuments={invoiceDocuments} />;
};

DocumentsDetailsContainer.manifest = Object.freeze({
  invoiceDocumentsDetails: invoiceDocumentsResource,
});

DocumentsDetailsContainer.propTypes = {
  resources: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(DocumentsDetailsContainer));
