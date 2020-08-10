import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedTime,
} from '@folio/stripes-acq-components';

import { BATCH_VOUCHER_EXPORT_STATUS_LABEL } from '../../../common/constants';
import ExportVoucherButton from '../../../settings/BatchGroupConfigurationSettings/ExportVoucherButton';
import BatchGroupValue from '../BatchGroupValue';

const InvoiceBatchVoucherExport = ({ batchVoucherExport, exportFormat }) => {
  return (
    <Row>
      <Col xs={4}>
        <BatchGroupValue
          id={batchVoucherExport.batchGroupId}
          label={<FormattedMessage id="ui-invoice.invoice.details.batchVoucherExport.batchGroup" />}
        />
      </Col>

      <Col xs={4}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.batchVoucherExport.fileName" />}
        >
          <FolioFormattedTime dateString={batchVoucherExport.end} />
          <ExportVoucherButton
            batchVoucherId={batchVoucherExport.batchVoucherId}
            fileName={batchVoucherExport.end}
            format={exportFormat}
          />
        </KeyValue>
      </Col>

      <Col xs={4}>
        <KeyValue
          label={<FormattedMessage id="ui-invoice.invoice.details.batchVoucherExport.status" />}
          value={<FormattedMessage id={BATCH_VOUCHER_EXPORT_STATUS_LABEL[batchVoucherExport.status]} />}
        />
      </Col>
    </Row>
  );
};

InvoiceBatchVoucherExport.propTypes = {
  batchVoucherExport: PropTypes.object,
  exportFormat: PropTypes.string,
};

export default InvoiceBatchVoucherExport;
