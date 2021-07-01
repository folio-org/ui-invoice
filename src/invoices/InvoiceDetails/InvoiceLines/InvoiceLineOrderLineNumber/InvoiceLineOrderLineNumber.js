import React from 'react';
import PropTypes from 'prop-types';

import {
  IconButton,
  NoValue,
} from '@folio/stripes/components';

import { IS_EDIT_POST_APPROVAL } from '../../../../common/utils';

export const InvoiceLineOrderLineNumber = ({ invoiceLine, poLineNumber, link }) => {
  const isPostApproval = IS_EDIT_POST_APPROVAL(invoiceLine.id, invoiceLine.invoiceLineStatus);

  const onClick = (e) => {
    e.stopPropagation();

    link(invoiceLine);
  };

  return (
    <>
      {!isPostApproval && (
        <IconButton
          onClick={onClick}
          icon="link"
          size="medium"
        />
      )}

      {poLineNumber || <NoValue />}
    </>
  );
};

InvoiceLineOrderLineNumber.propTypes = {
  invoiceLine: PropTypes.object.isRequired,
  poLineNumber: PropTypes.string,
  link: PropTypes.func.isRequired,
};
