import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ClipCopy } from '@folio/stripes/smart-components';
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
          id="po-line-lookup-tooltip"
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

      {poLineNumber
        ? (
          <>
            {poLineNumber}
            <span // eslint-disable-line jsx-a11y/click-events-have-key-events
              data-testid="clip-copy-icon"
              tabIndex="0"
              role="button"
              onClick={e => e.stopPropagation()}
            >
              <ClipCopy text={poLineNumber} />
            </span>
          </>
        )
        : <NoValue />
      }
    </>
  );
};

InvoiceLineOrderLineNumber.propTypes = {
  invoiceLine: PropTypes.object.isRequired,
  poLineNumber: PropTypes.string,
  link: PropTypes.func.isRequired,
};
