import get from 'lodash/get';
import {
  memo,
  useCallback,
} from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import { TitleManager } from '@folio/stripes/core';
import {
  VersionHistoryPane,
  VersionView,
  VersionViewContextProvider,
} from '@folio/stripes-acq-components';

import { INVOICE_ROUTE } from '../../../common/constants';
import {
  useInvoice,
  useInvoiceVersions,
  useSelectedInvoiceVersion,
} from '../../../common/hooks';
import {
  HIDDEN_INVOICE_FIELDS,
  INVOICE_FIELDS_LABEL_MAP,
} from '../constants';
import { VersionHistoryView } from './VersionHistoryView';

const VersionHistory = ({
  history,
  location,
  match,
}) => {
  const { id, versionId } = match.params;
  const invoicePath = `${INVOICE_ROUTE}/view/${id}`;
  const snapshotPath = 'invoiceSnapshot.map';

  const { invoice, isLoading: isInvoiceLoading } = useInvoice(id);

  const onHistoryClose = useCallback(() => history.push({
    pathname: invoicePath,
    search: location.search,
  }), [history, invoicePath, location.search]);

  const onVersionClose = useCallback(() => history.push({
    pathname: INVOICE_ROUTE,
    search: location.search,
  }), [history, location.search]);

  const onSelectVersion = useCallback((_versionId) => {
    history.push({
      pathname: `${invoicePath}/versions/${_versionId}`,
      search: location.search,
    });
  }, [history, location.search, invoicePath]);

  const { versions, isLoading: isInvoiceVersionsLoading } = useInvoiceVersions(
    id,
    {
      onSuccess: ({ invoiceAuditEvents }) => {
        if (!versionId && invoiceAuditEvents[0]?.id) onSelectVersion(invoiceAuditEvents[0].id);
      },
    },
  );

  const {
    isLoading: isSelectedVersionLoading,
    selectedVersion,
  } = useSelectedInvoiceVersion({ versionId, versions, snapshotPath });

  const isLoading = isInvoiceLoading || isInvoiceVersionsLoading || isSelectedVersionLoading;

  return (
    <VersionViewContextProvider
      snapshotPath={snapshotPath}
      versions={versions}
      versionId={versionId}
    >
      <TitleManager record={invoice?.vendorInvoiceNo} />
      <VersionView
        id="order"
        dismissible
        isLoading={isLoading}
        onClose={onVersionClose}
        versionId={versionId}
        paneTitle={(
          <FormattedMessage
            id="ui-invoice.invoice.details.paneTitle"
            values={{ vendorInvoiceNo: invoice?.vendorInvoiceNo }}
          />
        )}
        tags={get(invoice, 'tags.tagList', [])}
      >
        <VersionHistoryView version={selectedVersion} />
      </VersionView>

      <VersionHistoryPane
        currentVersion={versionId}
        id="order-line"
        isLoading={isInvoiceVersionsLoading}
        onClose={onHistoryClose}
        onSelectVersion={onSelectVersion}
        snapshotPath={snapshotPath}
        labelsMap={INVOICE_FIELDS_LABEL_MAP}
        versions={versions}
        hiddenFields={HIDDEN_INVOICE_FIELDS}
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
