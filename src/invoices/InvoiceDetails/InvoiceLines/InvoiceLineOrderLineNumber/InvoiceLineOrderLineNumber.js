import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IconButton,
  NoValue,
  Tooltip,
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
        <Tooltip
          text={<FormattedMessage id="ui-invoice.poLineLookup" />}
        >
          {({ ref, ariaIds }) => (
            <IconButton
              onClick={onClick}
              icon="link"
              size="medium"
              ref={ref}
              aria-labelledby={ariaIds.text}
            />
          )}
        </Tooltip>
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
