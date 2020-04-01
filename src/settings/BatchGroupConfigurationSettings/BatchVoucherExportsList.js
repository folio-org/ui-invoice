import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IconButton,
  Layout,
  MultiColumnList,
} from '@folio/stripes/components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import { BATCH_VOUCHER_EXPORT_STATUS_LABEL } from '../../common/constants';

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
  exportButton: () => (
    <Layout element="span" className="full textRight">
      <IconButton
        data-test-batch-voucher-export-download
        icon="download"
      />
    </Layout>
  ),
  status: ({ status }) => BATCH_VOUCHER_EXPORT_STATUS_LABEL[status],
};

export default function BatchVoucherExportsList({ batchVoucherExports }) {
  if (!batchVoucherExports) return null;

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={batchVoucherExports}
      formatter={cellFormatters}
      id="batch-voucher-exports"
      interactive={false}
      sortDirection="descending"
      sortOrder="date"
      totalCount={batchVoucherExports.length}
      visibleColumns={visibleColumns}
    />
  );
}

BatchVoucherExportsList.propTypes = {
  batchVoucherExports: PropTypes.arrayOf(PropTypes.object),
};