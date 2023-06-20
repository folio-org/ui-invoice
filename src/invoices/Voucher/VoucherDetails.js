import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  Loading,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import { VOUCHER_STATUS_LABEL } from '../../common/constants';
import VendorAddress from './VendorAddress';
import { useDefaultAccountingCode } from '../../common/hooks';

const VoucherDetails = ({ voucher, withVendorAddress }) => {
  const { isLoading, accountNo } = useDefaultAccountingCode(voucher);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.status" />}
            value={VOUCHER_STATUS_LABEL[voucher.status] || voucher.status}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
            value={voucher.voucherNumber}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherDate" />}
            value={<FolioFormattedDate value={voucher.voucherDate} utc={false} />}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.total" />}
          >
            <AmountWithCurrencyField
              amount={voucher.amount}
              currency={voucher.systemCurrency}
            />
          </KeyValue>
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.exchangeRate" />}
            value={voucher.exchangeRate}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementNumber" />}
            value={voucher.disbursementNumber}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementDate" />}
            value={<FolioFormattedDate value={voucher.disbursementDate} />}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.disbursementAmount" />}
          >
            <AmountWithCurrencyField
              amount={voucher.disbursementAmount}
              currency={voucher.systemCurrency}
            />
          </KeyValue>
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.accountNo" />}
            value={accountNo}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.accountingCode" />}
            value={voucher.accountingCode}
          />
        </Col>

        <Col xs={3}>
          <Checkbox
            checked={voucher.enclosureNeeded}
            disabled
            label={<FormattedMessage id="ui-invoice.invoice.enclosureNeeded" />}
            type="checkbox"
            vertical
          />
        </Col>
      </Row>

      {withVendorAddress && (
      <VendorAddress
        vendorId={voucher.vendorId}
        address={voucher.vendorAddress}
      />
      )}
    </>
  );
};

VoucherDetails.propTypes = {
  voucher: PropTypes.object.isRequired,
  withVendorAddress: PropTypes.bool,
};

VoucherDetails.defaultProps = {
  withVendorAddress: false,
};

export default VoucherDetails;
