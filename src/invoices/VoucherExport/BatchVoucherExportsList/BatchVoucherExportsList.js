import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  DESC_DIRECTION,
  FolioFormattedTime,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import {
  BATCH_VOUCHER_EXPORT_STATUS,
  BATCH_VOUCHER_EXPORT_STATUS_LABEL,
} from '../../../common/constants';
import { ExportVoucherButton } from '../ExportVoucherButton';
import {
  BV_EXPORT_COLUMN_MAPPING,
  BV_EXPORT_LIST_COLUMNS,
  BV_EXPORT_NON_INTERACTIVE_COLUMNS,
  ROW_PROPS,
} from './constants';

export function BatchVoucherExportsList({
  batchVoucherExports,
  columnIdPrefix,
  format,
  isLoading,
  onHeaderClick,
  onNeedMoreData,
  pagination,
  sortDirection,
  sortedColumn,
  totalCount,
}) {
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

  return (
    <>
      <MultiColumnList
        columnIdPrefix={columnIdPrefix}
        columnMapping={BV_EXPORT_COLUMN_MAPPING}
        contentData={batchVoucherExports}
        formatter={cellFormatters}
        id="batch-voucher-exports"
        interactive={false}
        loading={isLoading}
        rowFormatter={acqRowFormatter}
        rowProps={ROW_PROPS}
        totalCount={totalCount}
        visibleColumns={BV_EXPORT_LIST_COLUMNS}
        onHeaderClick={onHeaderClick}
        nonInteractiveHeaders={BV_EXPORT_NON_INTERACTIVE_COLUMNS}
        sortDirection={sortDirection || DESC_DIRECTION}
        sortedColumn={sortedColumn || BV_EXPORT_LIST_COLUMNS[0]}
      />
      {
        Boolean(batchVoucherExports?.length) && (
          <PrevNextPagination
            {...pagination}
            totalCount={totalCount}
            onChange={onNeedMoreData}
            disabled={isLoading}
          />
        )
      }
    </>
  );
}

BatchVoucherExportsList.propTypes = {
  batchVoucherExports: PropTypes.arrayOf(PropTypes.object),
  columnIdPrefix: PropTypes.string.isRequired,
  format: PropTypes.string,
  isLoading: PropTypes.bool,
  onHeaderClick: PropTypes.func,
  onNeedMoreData: PropTypes.func,
  pagination: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
  }),
  sortDirection: PropTypes.string,
  sortedColumn: PropTypes.string,
  totalCount: PropTypes.number,
};
