import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Icon,
} from '@folio/stripes/components';

class InvoiceDetails extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object,
  };

  renderLoadingPane = () => {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-invoiceDetailsLoading"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
      >
        <div>
          <Icon
            icon="spinner-ellipsis"
            width="100px"
          />
        </div>
      </Pane>
    );
  };

  render() {
    const {
      onClose,
      invoice,
    } = this.props;

    if (!invoice) return this.renderLoadingPane();

    const paneTitle = (
      <FormattedMessage
        id="ui-invoice.invoice.details.paneTitle"
        values={{ vendorInvoiceNo: invoice.vendorInvoiceNo }}
      />
    );

    return (
      <Pane
        id="pane-invoiceDetails"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
      >
        {invoice.id}
      </Pane>
    );
  }
}

export default InvoiceDetails;
