import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const AmountWithPercentField = ({ amount }) => {
  return (
    <Fragment>
      {amount}
      <FormattedMessage id="ui-invoice.adjustment.type.sign.percent" />
    </Fragment>
  );
};

AmountWithPercentField.propTypes = {
  amount: PropTypes.number,
};

export default AmountWithPercentField;
