import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Checkbox,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { TextField } from '@folio/stripes-acq-components';

import SettingsVoucherNumberReset from './SettingsVoucherNumberReset';
import { hasEditSettingsPerm } from '../utils';

import css from './VoucherNumber.css';

const validatePrefix = prefix => (
  prefix?.match(/[^a-zA-Z]/)
    ? <FormattedMessage id="ui-invoice.settings.voucherNumber.prefixValidation" />
    : undefined
);

const SettingsVoucherNumberForm = () => {
  const stripes = useStripes();
  const hasEditPerm = hasEditSettingsPerm(stripes);

  return (
    <>
      <Row>
        <Col xs={12}>
          <Field
            isNonInteractive={!hasEditPerm}
            component={TextField}
            id="voucherNumberPrefix"
            label={<FormattedMessage id="ui-invoice.settings.voucherNumber.prefix" />}
            name="voucherNumberPrefix"
            validate={validatePrefix}
          />
        </Col>
      </Row>

      <SettingsVoucherNumberReset isNonInteractive={!hasEditPerm} />

      <Row>
        <Col xs={12} className={css.allowNumberEdit}>
          <Field
            disabled={!hasEditPerm}
            component={Checkbox}
            label={<FormattedMessage id="ui-invoice.settings.voucherNumber.allowVoucherNumberEdit" />}
            name="allowVoucherNumberEdit"
            type="checkbox"
          />
        </Col>
      </Row>
    </>
  );
};

SettingsVoucherNumberForm.propTypes = {};

export default SettingsVoucherNumberForm;
