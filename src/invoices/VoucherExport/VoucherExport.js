import React, { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';

import {
  checkScope,
  HasCommand,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  handleKeyCommand,
} from '@folio/stripes-acq-components';

const VoucherExport = () => {
  const history = useHistory();
  const location = useLocation();

  const onCancel = useCallback(() => (
    history.push({
      pathname: '/invoice',
      search: location.search,
    })
  ), [history, location.search]);

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/invoice')),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <Pane
          defaultWidth="100%"
          dismissible
          id="pane-voucher-export"
          onClose={onCancel}
          paneTitle={<FormattedMessage id="ui-invoice.voucherExport.paneTitle" />}
        />
      </Paneset>
    </HasCommand>
  );
};

export default VoucherExport;
