import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import {
  Col,
  Row,
  Button,
  KeyValue,
  Callout,
  TextField,
} from '@folio/stripes/components';

import {
  VOUCHER_NUMBER_START,
} from '../../common/resources';

const SettingsVoucherNumberReset = ({ resources, mutator }) => {
  const callout = useRef();
  const [sequenceNumber, setSequenceNumber] = useState();

  const getStartSequenceNumber = useCallback(() => {
    return get(resources, ['voucherNumber', 'records', 0, 'sequenceNumber'], '');
  }, [resources]);

  const onReset = useCallback(async () => {
    try {
      await mutator.sequenceNumber.replace(sequenceNumber);
      await mutator.voucherNumber.POST({});
    } catch (e) {
      callout.current.sendCallout({
        type: 'error',
        message: (
          <FormattedMessage
            data-test-invoice-settings-voucher-number-error
            id="ui-invoice.settings.voucherNumber.startNumber.error"
          />
        ),
      });
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [sequenceNumber]);

  useEffect(() => {
    setSequenceNumber(getStartSequenceNumber());
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [resources.voucherNumber]);

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <TextField
            label={<FormattedMessage id="ui-invoice.settings.voucherNumber.startNumber" />}
            name="sequenceNumber"
            type="number"
            value={sequenceNumber}
            onChange={({ target }) => setSequenceNumber(target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          data-test-invoice-settings-voucher-number-start
        >
          <KeyValue
            label={<FormattedMessage id="ui-invoice.settings.voucherNumber.firstInSequence" />}
            value={getStartSequenceNumber()}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-invoice.settings.voucherNumber.nextInSequence" />}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Button
            onClick={onReset}
            disabled={!sequenceNumber}
            data-test-invoice-settings-voucher-number-reset
          >
            <FormattedMessage id="ui-invoice.settings.voucherNumber.reset" />
          </Button>
        </Col>
      </Row>
      <Callout ref={callout} />
    </Fragment>
  );
};

SettingsVoucherNumberReset.manifest = Object.freeze({
  voucherNumber: VOUCHER_NUMBER_START,
  sequenceNumber: {},
});

SettingsVoucherNumberReset.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(SettingsVoucherNumberReset);
