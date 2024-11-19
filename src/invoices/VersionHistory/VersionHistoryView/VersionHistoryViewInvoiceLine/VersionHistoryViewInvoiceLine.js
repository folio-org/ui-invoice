import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@folio/stripes/components';
import { useColumnManager } from '@folio/stripes/smart-components';
import { FrontendSortingMCL } from '@folio/stripes-acq-components';

import {
  useOrderLines,
  useVendors,
} from '../../../../common/hooks';
import { INVOICE_LINES_COLUMN_MAPPING } from '../../../constants';
import {
  useInvoiceLinesByInvoiceId,
  useOrdersByPoNumbers,
} from '../hooks';
import {
  buildQueryByIds,
  getResultsFormatter,
} from './utils';

import styles from './style.css';

const COLUMN_LINE_NUMBER = 'lineNumber';

export const VersionHistoryViewInvoiceLine = ({ version = {} }) => {
  const {
    invoiceLines = [],
    isLoading: isInvoiceLinesLoading,
  } = useInvoiceLinesByInvoiceId(version?.id);
  const {
    orders = [],
    isLoading: isOrdersLoading,
  } = useOrdersByPoNumbers(version?.poNumbers);

  const orderLineIds = useMemo(() => invoiceLines.map(({ poLineId }) => poLineId), [invoiceLines]);

  const {
    orderLines,
    isLoading: isOrderLinesLoading,
  } = useOrderLines(orderLineIds, { buildQuery: buildQueryByIds });
  const {
    vendors,
    isLoading: isVendorsLoading,
  } = useVendors(orders.map(({ vendor }) => vendor));

  const currency = version?.currency;

  const orderLinesMap = useMemo(() => keyBy(orderLines, 'id'), [orderLines]);
  const ordersMap = useMemo(() => keyBy(orders, 'id'), [orders]);
  const vendorsMap = useMemo(() => keyBy(vendors, 'id'), [vendors]);

  const { visibleColumns } = useColumnManager(
    'invoice-lines-column-manager',
    INVOICE_LINES_COLUMN_MAPPING,
  );

  const sorters = useMemo(() => ({
    [COLUMN_LINE_NUMBER]: ({ invoiceLineNumber }) => Number(invoiceLineNumber),
    polNumber: ({ poLineId }) => Number(orderLinesMap?.[poLineId]?.poLineNumber?.replace('-', '.')),
    description: ({ description }) => description,
  }), [orderLinesMap]);

  const resultsFormatter = useMemo(() => {
    return getResultsFormatter({
      orderLinesMap,
      currency,
      vendorsMap,
      ordersMap,
    });
  }, [orderLinesMap, currency, ordersMap, vendorsMap]);

  const isLoading = isInvoiceLinesLoading || isOrderLinesLoading || isVendorsLoading || isOrdersLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.invoiceLinesTotal}>
        <FormattedMessage
          id="ui-invoice.invoiceLine.total"
          values={{ total: invoiceLines.length }}
        />
      </div>

      <FrontendSortingMCL
        id="invoice-lines-list"
        contentData={invoiceLines}
        visibleColumns={visibleColumns}
        columnMapping={INVOICE_LINES_COLUMN_MAPPING}
        formatter={resultsFormatter}
        hasArrow
        sortedColumn={COLUMN_LINE_NUMBER}
        sorters={sorters}
      />
    </>
  );
};

VersionHistoryViewInvoiceLine.propTypes = {
  version: PropTypes.object.isRequired,
};
