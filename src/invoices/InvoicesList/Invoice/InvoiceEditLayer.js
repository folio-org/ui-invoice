import React, { Component } from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Layer,
} from '@folio/stripes/components';

import {
  INVOICE_API,
} from '../../../common/constants';
import LoadingPane from '../../../common/LoadingPane/LoadingPane';
import InvoiceForm from '../../InvoiceForm';

class InvoiceEditLayer extends Component {
  static manifest = Object.freeze({
    invoice: {
      type: 'okapi',
      path: `${INVOICE_API}/:{id}`,
      throwErrors: false,
    },
  });

  static propTypes = {
    connectedSource: PropTypes.object.isRequired,
    onCloseEdit: PropTypes.func.isRequired,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  }

  saveInvoice = (invoice) => {
    const { onCloseEdit, parentMutator } = this.props;

    parentMutator.records.PUT(invoice)
      .then(() => onCloseEdit())
      .catch(() => ({ id: 'Unable to save invoice' }));
  }

  render() {
    const {
      connectedSource,
      intl,
      onCloseEdit,
      parentMutator,
      parentResources,
      resources,
      stripes,
    } = this.props;
    const invoice = get(resources, ['invoice', 'records', 0]);
    const hasLoaded = get(resources, 'invoice.hasLoaded');

    return (
      <Layer
        isOpen
        contentLabel={intl.formatMessage({ id: 'ui-invoice.invoice.editLayer' })}
      >
        {hasLoaded
          ? (
            <InvoiceForm
              stripes={stripes}
              initialValues={invoice}
              connectedSource={connectedSource}
              parentResources={parentResources}
              parentMutator={parentMutator}
              onSubmit={this.saveInvoice}
              onCancel={onCloseEdit}
            />
          )
          : <LoadingPane onClose={onCloseEdit} />
        }

      </Layer>
    );
  }
}

export default injectIntl(InvoiceEditLayer);
