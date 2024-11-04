import {
  memo,
  useCallback,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { TitleManager } from '@folio/stripes/core';
import {
  VersionHistoryPane,
  VersionViewContextProvider,
} from '@folio/stripes-acq-components';
import { INVOICE_ROUTE } from '../../common/constants';

// TODO: UINV-469 Invoices - Display all versions in change log in fourth pane
const VersionHistory = ({
  history,
  location,
  match,
}) => {
  const { id } = match.params;
  const snapshotPath = 'orderLineSnapshot.map';
  const invoicePath = `${INVOICE_ROUTE}/view/${id}`;

  const onHistoryClose = useCallback(() => history.push({
    pathname: invoicePath,
    search: location.search,
  }), [history, invoicePath, location.search]);

  const onSelectVersion = () => {};

  return (
    <VersionViewContextProvider
      snapshotPath={snapshotPath}
      versions={[]}
      versionId="versionId"
    >
      <TitleManager record="Title" />

      <VersionHistoryPane
        currentVersion="versionId"
        id="order-line"
        isLoading={false}
        onClose={onHistoryClose}
        onSelectVersion={onSelectVersion}
        snapshotPath={snapshotPath}
        labelsMap={{}}
        versions={[]}
        hiddenFields={{}}
      />
    </VersionViewContextProvider>
  );
};

VersionHistory.propTypes = {
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  match: ReactRouterPropTypes.match,
};

export default memo(VersionHistory);
