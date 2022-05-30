import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';

import {
  Col,
  KeyValue,
  Label,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  KeyValueInline,
} from '@folio/stripes-acq-components';

import { VOUCHER_STATUS_LABEL } from '../../../common/constants';
import {
  LINE_FIELDS_LABELS,
  LINE_FIELDS_MAP,
} from './constants';
import css from './ComponentToPrint.css';

function PrintValue({ path, source, currency }) {
  const value = get(source, path, null);

  switch (path) {
    case LINE_FIELDS_MAP.amount:
      return (
        <AmountWithCurrencyField
          currency={currency}
          amount={value}
        />
      );
    case LINE_FIELDS_MAP.fundDistributions:
      return source[path]?.map(({ code }) => code).join(', ') || null;
    default:
      return value ?? <NoValue />;
  }
}

PrintValue.propTypes = {
  path: PropTypes.string.isRequired,
  source: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
};

const ComponentToPrint = ({ dataSource: { batchGroup, voucher, vendor, invoice, voucherLines } = {} }) => {
  return (
    <>
      <Row>
        <Col xs={6}>
          <Label>
            <FormattedMessage id="ui-invoice.voucher.print.voucher" />
          </Label>
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.settings.batchGroups.labelSingular" />}
            value={batchGroup?.name}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherDate" />}
            value={<FolioFormattedDate value={voucher?.voucherDate} utc={false} />}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.voucherNumber" />}
            value={voucher?.voucherNumber}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.status" />}
            value={VOUCHER_STATUS_LABEL[voucher?.status] || voucher?.status}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.accountingCode" />}
            value={voucher?.accountingCode}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.vendor.name" />}
            value={vendor?.name}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.vendor.code" />}
            value={vendor?.code}
          />
        </Col>
        <Col xs={6}>
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.accountNo" />}
            value={voucher.accountNo}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.vendorInvoiceNo" />}
            value={invoice.vendorInvoiceNo}
          />

          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.information.invoiceDate" />}
            value={<FolioFormattedDate value={invoice?.invoiceDate} />}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.voucher.print.invoiceTotal" />}
            value={<AmountWithCurrencyField amount={invoice?.total} currency={invoice?.currency} />}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.currency" />}
            value={voucher?.invoiceCurrency}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.invoice.details.voucher.exchangeRate" />}
            value={voucher?.exchangeRate}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-invoice.voucher.print.voucherTotal" />}
            value={<AmountWithCurrencyField amount={voucher?.amount} currency={voucher?.systemCurrency} />}
          />
        </Col>
      </Row>

      {voucherLines?.map((line, i) => {
        return (
          <div key={line.id}>
            <Row>
              <Col xs={12}>
                <KeyValue
                  label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP.lineNumber]}
                >
                  {i + 1}
                </KeyValue>
              </Col>
            </Row>
            <Row className={css.voucherLineBlock}>
              {Object.keys(LINE_FIELDS_MAP).map((col) => {
                if (col === LINE_FIELDS_MAP.lineNumber) return null;

                return (
                  <Col xs={3} key={col}>
                    <KeyValue
                      label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]}
                    >
                      <PrintValue currency={voucher?.systemCurrency} path={LINE_FIELDS_MAP[col]} source={line} />
                    </KeyValue>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}
    </>
  );
};

ComponentToPrint.propTypes = {
  dataSource: PropTypes.object,
};

export default ComponentToPrint;
