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

import { INVOICE_ROUTE } from '../../common/constants';
import {
  useInvoice,
  useInvoiceLine,
  useInvoiceLineVersions,
  useSelectedInvoiceLineVersion,
  useVendors,
} from '../../common/hooks';
import {
  HIDDEN_INVOICE_LINE_FIELDS,
  INVOICE_LINE_FIELDS_LABEL_MAP,
} from './constants';
import { VersionHistoryView } from './VersionHistoryView';

const InvoiceLineVersionHistory = ({
  history,
  location,
  match,
}) => {
  const {
    id: invoiceId,
    lineId,
    versionId,
  } = match.params;
  const invoiceLinePath = `${INVOICE_ROUTE}/view/${invoiceId}/line/${lineId}/view`;
  const snapshotPath = 'invoiceLineSnapshot.map';

  const {
    invoiceLine,
    isLoading: isInvoiceLineLoading,
  } = useInvoiceLine(lineId);
  const {
    invoice,
    isLoading: isInvoiceLoading,
  } = useInvoice(invoiceId);
  const {
    vendors,
    isLoading: isVendorLoading,
  } = useVendors([invoice?.vendorId]);

  const onHistoryClose = useCallback(() => history.push({
    pathname: invoiceLinePath,
    search: location.search,
  }), [history, invoiceLinePath, location.search]);

  const onVersionClose = useCallback(() => history.push({
    pathname: INVOICE_ROUTE,
    search: location.search,
  }), [history, location.search]);

  const onSelectVersion = useCallback((_versionId) => {
    history.push({
      pathname: `${invoiceLinePath}/versions/${_versionId}`,
      search: location.search,
    });
  }, [history, location.search, invoiceLinePath]);

  const {
    versions,
    isLoading: isInvoiceLineVersionsLoading,
  } = useInvoiceLineVersions(
    lineId,
    {
      onSuccess: ({ invoiceLineAuditEvents }) => {
        if (!versionId && invoiceLineAuditEvents[0]?.id) {
          onSelectVersion(invoiceLineAuditEvents[0].id);
        }
      },
    },
  );

  const {
    isLoading: isSelectedVersionLoading,
    selectedVersion,
  } = useSelectedInvoiceLineVersion({ versionId, versions, snapshotPath });

  const { invoiceLineNumber } = invoiceLine;
  const paneSubTitle = `${invoice?.vendorInvoiceNo} - ${vendors?.[0]?.code}`;

  const isLoading = (
    isVendorLoading
    || isInvoiceLineLoading
    || isInvoiceLoading
    || isInvoiceLineVersionsLoading
    || isSelectedVersionLoading
  );

  return (
    <VersionViewContextProvider
      snapshotPath={snapshotPath}
      versions={versions}
      versionId={versionId}
    >
      <TitleManager record={invoiceLineNumber} />
      <VersionView
        id="invoice-line"
        dismissible
        isLoading={isLoading}
        onClose={onVersionClose}
        versionId={versionId}
        paneSub={paneSubTitle}
        paneTitle={(
          <FormattedMessage
            id="ui-invoice.invoiceLine.paneTitle.view"
            values={{ invoiceLineNumber }}
          />
        )}
        tags={get(invoiceLine, 'tags.tagList', [])}
      >
        <VersionHistoryView version={selectedVersion} />
      </VersionView>

      <VersionHistoryPane
        currentVersion={versionId}
        id="invoice-line-pane"
        isLoading={isInvoiceLineVersionsLoading}
        onClose={onHistoryClose}
        onSelectVersion={onSelectVersion}
        snapshotPath={snapshotPath}
        labelsMap={INVOICE_LINE_FIELDS_LABEL_MAP}
        versions={versions}
        hiddenFields={HIDDEN_INVOICE_LINE_FIELDS}
      />
    </VersionViewContextProvider>
  );
};

InvoiceLineVersionHistory.propTypes = {
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  match: ReactRouterPropTypes.match,
};

export default memo(InvoiceLineVersionHistory);
