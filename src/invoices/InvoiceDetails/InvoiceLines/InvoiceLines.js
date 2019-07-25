import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import {
  invoiceLinesResource,
} from '../../../common/resources';
import styles from './InvoiceLines.css';

const visibleColumns = ['description', 'invoiceLineNumber', 'quantity', 'subTotal'];
const columnMapping = {
  description: <FormattedMessage id="ui-invoice.invoice.details.lines.list.description" />,
  invoiceLineNumber: <FormattedMessage id="ui-invoice.invoice.details.lines.list.number" />,
  quantity: <FormattedMessage id="ui-invoice.invoice.details.lines.list.quantity" />,
  subTotal: <FormattedMessage id="ui-invoice.invoice.details.lines.list.total" />,
};
const columnWidths = {
  description: '40%',
  invoiceLineNumber: '20%',
  quantity: '20%',
  subTotal: '20%',
};

class InvoiceLines extends Component {
  static manifest = Object.freeze({
    invoiceLines: {
      ...invoiceLinesResource,
      GET: {
        params: {
          query: (queryParams, pathComponents, resourceValues) => {
            if (resourceValues.invoiceId && resourceValues.invoiceId.length) {
              return `(invoiceId==${resourceValues.invoiceId})`;
            }

            return null;
          },
        },
      },
    },
    invoiceId: {},
    query: {},
  });

  static propTypes = {
    invoiceId: PropTypes.string.isRequired,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
  };

  componentDidUpdate() {
    const { invoiceId, resources, mutator } = this.props;

    if (invoiceId !== resources.invoiceId) {
      mutator.invoiceId.replace(invoiceId);
    }
  }

  openLineDetails = (e, invoiceLine) => {
    const _path = `/invoice/view/${invoiceLine.invoiceId}/line/${invoiceLine.id}/view`;

    this.props.mutator.query.update({ _path });
  }

  render() {
    const { resources } = this.props;
    const invoiceLinesItems = get(resources, 'invoiceLines.records.0.invoiceLines', []);

    return (
      <Fragment>
        <div className={styles.invoiceLinesTotal}>
          <FormattedMessage
            id="ui-invoice.invoiceLine.total"
            values={{ total: invoiceLinesItems.length }}
          />
        </div>

        <MultiColumnList
          contentData={invoiceLinesItems}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          onRowClick={this.openLineDetails}
        />
      </Fragment>
    );
  }
}

export default stripesConnect(InvoiceLines);
