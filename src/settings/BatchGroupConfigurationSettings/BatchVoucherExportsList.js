import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import {
  FolioFormattedTime,
  acqRowFormatter,
} from '@folio/stripes-acq-components';

import { BATCH_VOUCHER_EXPORT_STATUS_LABEL } from '../../common/constants';
import { RESULT_COUNT_INCREMENT } from './constants';
import BatchVouchersContainer from './BatchVouchers';

const columnMapping = {
  date: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.date" />,
  status: <FormattedMessage id="ui-invoice.settings.BatchVoucherExports.status" />,
  exportButton: ' ',
};
const visibleColumns = ['date', 'status', 'exportButton'];
const cellFormatters = {
  date: d => (
    <FolioFormattedTime dateString={d.end || d.start} />
  ),
  // eslint-disable-next-line react/prop-types
  exportButton: ({ batchVoucherId }) => (
    <BatchVouchersContainer batchVoucherId={batchVoucherId} />
  ),
  status: ({ status }) => BATCH_VOUCHER_EXPORT_STATUS_LABEL[status],
};

const rowProps = { alignLastColToEnd: true };

export function BatchVoucherExportsList({ batchVoucherExports, onNeedMoreData, recordsCount }) {
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
  onNeedMoreData: PropTypes.func,
  recordsCount: PropTypes.number,
};
