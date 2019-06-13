import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import LoadingPane from '../../../common/LoadingPane/LoadingPane';
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
    onEdit: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
  }

  render() {
    const {
      onClose,
      onEdit,
      resources,
    } = this.props;
    const invoice = get(resources, ['invoice', 'records', 0]);
    const hasLoaded = get(resources, 'invoice.hasLoaded');

    return hasLoaded
      ? (
        <InvoiceDetails
          onClose={onClose}
          onEdit={onEdit}
          invoice={invoice}
        />
      )
      : <LoadingPane onClose={onClose} />;
  }
}

export default InvoiceDetailsLayer;
