import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { LoadingPane } from '../../../common/components';
import {
  invoiceResource,
} from '../../../common/resources';

class InvoiceLineDetailsLayer extends Component {
  static manifest = Object.freeze({
    invoice: invoiceResource,
    query: {},
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
    const hasLoaded = get(resources, 'invoice.hasLoaded');

    return hasLoaded
      ? (
        null
      )
      : <LoadingPane onClose={onClose} />;
  }
}

export default InvoiceLineDetailsLayer;
