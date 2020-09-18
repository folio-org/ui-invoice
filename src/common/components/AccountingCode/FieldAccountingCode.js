import React from 'react';
import PropTypes from 'prop-types';

import { FieldSelectionFinal } from '@folio/stripes-acq-components';

import AccountingCodeValue from './AccountingCodeValue';

const FieldAccountingCode = ({ isNonInteractive, value, name, accountingCodeOptions, readOnly }) => (
  isNonInteractive
    ? <AccountingCodeValue value={value} />
    : (
      <FieldSelectionFinal
        dataOptions={accountingCodeOptions}
        labelId="ui-invoice.invoice.accountingCode"
        name={name}
        readOnly={readOnly}
      />
    )
);

FieldAccountingCode.propTypes = {
  accountingCodeOptions: PropTypes.arrayOf(PropTypes.object),
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
};

FieldAccountingCode.defaultProps = {
  isNonInteractive: false,
  readOnly: false,
};

export default FieldAccountingCode;
