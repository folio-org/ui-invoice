import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  FolioFormattedTime,
  acqRowFormatter,
} from '@folio/stripes-acq-components';

import {
  BATCH_VOUCHER_EXPORT_STATUS,
  BATCH_VOUCHER_EXPORT_STATUS_LABEL,
} from '../../common/constants';
import { RESULT_COUNT_INCREMENT } from './constants';
import ExportVoucherButton from './ExportVoucherButton';

const columnMapping = {
  date: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.date" />,
  status: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.status" />,
  message: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.message" />,
  exportButton: ' ',
};
const visibleColumns = ['date', 'status', 'message', 'exportButton'];
const rowProps = { alignLastColToEnd: true };

export function BatchVoucherExportsList({ batchVoucherExports, format, onNeedMoreData, recordsCount }) {
  const cellFormatters = useMemo(
    () => ({
      date: d => (
        <FolioFormattedTime dateString={d.end || d.start} />
      ),
      // eslint-disable-next-line react/prop-types
      exportButton: ({ batchVoucherId, end }) => (
        <ExportVoucherButton
          batchVoucherId={batchVoucherId}
          fileName={end}
          format={format}
        />
      ),
      status: ({ status }) => BATCH_VOUCHER_EXPORT_STATUS_LABEL[status],
      // eslint-disable-next-line react/prop-types
      message: ({ message, status }) => (
        status === BATCH_VOUCHER_EXPORT_STATUS.uploaded
          ? <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.message.uploaded" />
          : message || <NoValue />
      ),
    }),
    [format],
  );

  if (!batchVoucherExports) return null;

  return (
    <MultiColumnList
      autosize
      columnMapping={columnMapping}
      contentData={batchVoucherExports}
      formatter={cellFormatters}
      id="batch-voucher-exports"
      interactive={false}
      onHeaderClick={() => { }}
      onNeedMoreData={onNeedMoreData}
      pageAmount={RESULT_COUNT_INCREMENT}
      pagingType="click"
      rowFormatter={acqRowFormatter}
      rowProps={rowProps}
      sortDirection="descending"
      sortOrder="date"
      totalCount={recordsCount}
      virtualize
      visibleColumns={visibleColumns}
    />
  );
}

BatchVoucherExportsList.propTypes = {
  batchVoucherExports: PropTypes.arrayOf(PropTypes.object),
  format: PropTypes.string,
  onNeedMoreData: PropTypes.func,
  recordsCount: PropTypes.number,
};
