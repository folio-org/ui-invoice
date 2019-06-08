import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  INVOICE_API,
} from '../../../common/constants';
import InvoiceDetails from '../../InvoiceDetails';

class InvoiceDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoice: {
      type: 'okapi',
      path: `${INVOICE_API}/:{id}`,
      throwErrors: false,
    },
  });

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
  }

  render() {
    const {
      onClose,
      resources,
    } = this.props;
    const invoice = get(resources, ['invoice', 'records', 0]);

    return (
      <InvoiceDetails
        onClose={onClose}
        invoice={invoice}
      />
    );
  }
}

export default InvoiceDetailsLayer;
