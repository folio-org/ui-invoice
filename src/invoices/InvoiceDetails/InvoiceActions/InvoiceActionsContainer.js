import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { configApprovals } from '../../../common/resources';

import InvoiceActions from './InvoiceActions';

const InvoiceActionsContainer = ({ invoice, invoiceLinesCount, mutator }) => {
  const [isApprovalsConfigLoaded, setIsApprovalsConfigLoaded] = useState(false);
  const [isApprovePayEnabled, setIsApprovePayEnabled] = useState(false);

  useEffect(
    () => {
      mutator.invoiceActionsApprovals.GET()
        .then(approvalsConfigResp => {
          let approvalsConfig;

          try {
            approvalsConfig = JSON.parse(get(approvalsConfigResp, [0, 'value'], '{}'));
          } catch (e) {
            approvalsConfig = {};
          }

          setIsApprovePayEnabled(approvalsConfig.isApprovePayEnabled || false);
          setIsApprovalsConfigLoaded(true);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return isApprovalsConfigLoaded && (
    <InvoiceActions
      invoiceLinesCount={invoiceLinesCount}
      invoice={invoice}
      isApprovePayEnabled={isApprovePayEnabled}
    />
  );
};

InvoiceActionsContainer.manifest = Object.freeze({
  invoiceActionsApprovals: configApprovals,
});

InvoiceActionsContainer.propTypes = {
  invoice: PropTypes.object.isRequired,
  invoiceLinesCount: PropTypes.number,
};

InvoiceActionsContainer.defaultProps = {
  invoiceLinesCount: 0,
};

export default stripesConnect(InvoiceActionsContainer);
