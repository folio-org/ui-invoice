import React from 'react';
import PropTypes from 'prop-types';

import css from './InvoiceDocument.css';

const InvoiceDocument = ({ name, downloadDocument }) => {
  return (
    downloadDocument ? (
      <button
        type="button"
        className={css.invoiceDocumentButton}
        onClick={downloadDocument}
      >
        {name}
      </button>
    ) : (
      <span>{name}</span>
    )
  );
};

InvoiceDocument.propTypes = {
  name: PropTypes.string.isRequired,
  downloadDocument: PropTypes.func,
};

export default InvoiceDocument;
