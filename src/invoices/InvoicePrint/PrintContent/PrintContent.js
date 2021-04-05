import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import get from 'lodash/get';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import { LINE_FIELDS_MAP, LINE_FIELDS_LABELS } from './constants';
import css from './PrintContent.css';
import cSS from './CtoPr.css';

const voucher = {
  'id': '227a06f6-0512-4dda-8a50-eb8c433b740e',
  'accountingCode': 'G64758-74835',
  'amount': 100.0,
  'batchGroupId': 'bbb27928-18fb-4b15-8074-1136125e4585',
  'invoiceCurrency': 'USD',
  'invoiceId': '629b094c-de0d-42a3-904c-0f551ed8ac1d',
  'exchangeRate': 1.0,
  'exportToAccounting': false,
  'status': 'Paid',
  'systemCurrency': 'USD',
  'type': 'Voucher',
  'voucherDate': '2021-01-23T17:26:29.443+0000',
  'voucherNumber': '9',
  'acqUnitIds': [],
  'metadata': {
    'createdDate': '2021-01-23T17:26:31.020+0000',
    'createdByUserId': '2c29ca80-f416-5b8e-9ca0-91ec36a72b59',
    'updatedDate': '2021-01-27T13:59:33.775+0000',
    'updatedByUserId': '2c29ca80-f416-5b8e-9ca0-91ec36a72b59',
  },
};
const voucherLines = [
  {
    'id': '5e3d3913-edd8-4a1e-abca-7c149f9da0d3',
    'amount': 50.0,
    'externalAccountNumber': 'L534706-00000-3600-000',
    'fundDistributions': [{
      'code': 'C519',
      'encumbrance': '6fd27f89-98db-4ddb-a11b-b62647ad7854',
      'fundId': 'da442302-88f0-45a8-a2d1-6a2322b629f5',
      'invoiceLineId': 'e9487a72-fc30-42ea-9119-34b1c9f18b4b',
      'distributionType': 'amount',
      'value': 50.0,
    }],
    'sourceIds': ['e9487a72-fc30-42ea-9119-34b1c9f18b4b'],
    'voucherId': 'b79b1db3-7c63-46a9-94ae-204ea871dede',
    'metadata': {
      'createdDate': '2021-01-26T18:42:18.187+0000',
      'createdByUserId': '2c29ca80-f416-5b8e-9ca0-91ec36a72b59',
      'updatedDate': '2021-01-26T18:42:18.187+0000',
      'updatedByUserId': '2c29ca80-f416-5b8e-9ca0-91ec36a72b59',
    },
  },
  {
    'id': '5e3d3913-edd8-4a1e-abca-7c149f9da0d4',
    'amount': 40.0,
    'externalAccountNumber': 'L534706-00000-3600-000',
    'fundDistributions': [{
      'code': 'C519',
      'encumbrance': '6fd27f89-98db-4ddb-a11b-b62647ad7854',
      'fundId': 'da442302-88f0-45a8-a2d1-6a2322b629f5',
      'invoiceLineId': 'e9487a72-fc30-42ea-9119-34b1c9f18b4b',
      'distributionType': 'amount',
      'value': 40.0,
    }],
    'sourceIds': ['e9487a72-fc30-42ea-9119-34b1c9f18b4b'],
    'voucherId': 'b79b1db3-7c63-46a9-94ae-204ea871dede',
    'metadata': {
      'createdDate': '2021-01-26T18:42:18.187+0000',
      'createdByUserId': '2c29ca80-f416-5b8e-9ca0-91ec36a72b59',
      'updatedDate': '2021-01-26T18:42:18.187+0000',
      'updatedByUserId': '2c29ca80-f416-5b8e-9ca0-91ec36a72b59',
    },
  },
];

function PrintColumn({ path, source }) {
  if (path === LINE_FIELDS_MAP.fundDistributions) {
    return source[path]?.map(({ code }) => code).join() || null;
  }
  if (path === LINE_FIELDS_MAP.lineNumber) {
    return source.id;
  }

  // console.log('path', path, get(source, path, null));

  const value = get(source, path, null);

  if (value === true) {
    return 'true';
  } else if (value === false) {
    return 'false';
  }

  return value;
}

const PrintContent = forwardRef((_, ref) => {
  return (
    <div className={css.hiddenContent}>
      <div
        ref={ref}
        style={{ pageBreakAfter: 'always' }}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label="Voucher"
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label="Batch Group"
            >
              FOLIO
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <div>Currency: {voucher.invoiceCurrency}</div>
          </Col>
          <Col xs={6}>
            <div>Date: {voucher.metadata.created_at}</div>
            <div>PO#: {voucher.poNumber}</div>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <div>Exchange rate: {voucher.exchangeRate}</div>
            <div>Voucher #: {voucher.voucherNumber}</div>
          </Col>
          <Col xs={6}>
            <div>Ship to</div>
            <div>
              some other adres
              3434
            </div>
          </Col>
        </Row>
        {voucherLines.map((line) => {
          return (
            <div key={line.id}>
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label="Line #"
                  >
                    {line.id}
                  </KeyValue>
                </Col>
              </Row>
              <Row className={cSS.colB}>
                {Object.keys(LINE_FIELDS_MAP).map((col) => {
                  if (col === LINE_FIELDS_MAP.lineNumber) return null;

                  return (
                    <Col xs={3} key={col}>
                      <KeyValue
                        label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]}
                      >
                        <PrintColumn path={LINE_FIELDS_MAP[col]} source={line} />
                      </KeyValue>
                    </Col>
                  );
                })}
              </Row>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PrintContent.propTypes = {
  // voucher: PropTypes.object.isRequired,
  // voucherLines: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(PrintContent, isEqual);
