import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { get } from 'lodash';

import { SearchAndSort } from '@folio/stripes/smart-components';

import packageInfo from '../../../package';
import {
  DATE_FORMAT,
  // api
  INVOICE_API,
} from '../../common/constants';
import {
  getInvoiceStatusLabel,
  formatAmount,
} from '../../common/utils';
import {
  VENDORS,
} from '../../common/resources';

import Invoice from './Invoice';

const filterConfig = [];
const visibleColumns = ['vendorInvoiceNo', 'vendor', 'invoiceDate', 'status', 'total'];
const columnMapping = {
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.invoice.list.vendorInvoiceNo" />,
  vendor: <FormattedMessage id="ui-invoice.invoice.list.vendor" />,
  invoiceDate: <FormattedMessage id="ui-invoice.invoice.list.invoiceDate" />,
  status: <FormattedMessage id="ui-invoice.invoice.list.status" />,
  total: <FormattedMessage id="ui-invoice.invoice.list.total" />,
};
const columnWidths = {
  vendorInvoiceNo: '18%',
  vendor: '35%',
  invoiceDate: '18%',
  status: '18%',
  total: '11%',
};
const baseResultsFormatter = {
  invoiceDate: invoice => {
    const invoiceDate = moment.utc(invoice.invoiceDate || '');

    return invoiceDate.isValid() ? invoiceDate.format(DATE_FORMAT) : '';
  },
  status: invoice => <FormattedMessage id={getInvoiceStatusLabel(invoice)} />,
  total: invoice => formatAmount(invoice.total),
};

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class InvoicesList extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    disableRecordCreation: PropTypes.bool,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    packageInfo: PropTypes.object,
  };

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  };

  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'invoices',
      recordsRequired: '%{resultCount}',
      path: INVOICE_API,
      perRequest: RESULT_COUNT_INCREMENT,
    },
    vendors: VENDORS,
  });

  render() {
    const {
      browseOnly,
      disableRecordCreation,
      mutator,
      onSelectRow,
      resources,
      showSingleResult,
      stripes,
    } = this.props;

    const vendors = get(resources, 'vendors.records', []);

    const resultsFormatter = {
      ...baseResultsFormatter,
      vendor: ({ vendorId }) => get(vendors.find(({ id }) => id === vendorId), 'name', ''),
    };

    return (
      <div data-test-invoices-list>
        <SearchAndSort
          packageInfo={this.props.packageInfo || packageInfo}
          objectName="invoice"
          baseRoute={packageInfo.stripes.route}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Invoice}
          onSelectRow={onSelectRow}
          viewRecordPerms="invoice.invoices.item.get"
          newRecordPerms="invoice.invoices.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={stripes}
          stripes={stripes}
          disableRecordCreation={disableRecordCreation}
          browseOnly={browseOnly}
          showSingleResult={showSingleResult}
        />
      </div>
    );
  }
}

export default InvoicesList;
