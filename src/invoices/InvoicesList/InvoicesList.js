import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { get } from 'lodash';

import { Callout } from '@folio/stripes/components';
import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
  showToast,
  sourceValues,
} from '@folio/stripes-acq-components';

import packageInfo from '../../../package';
import {
  // api
  INVOICE_API,
} from '../../common/constants';
import {
  getInvoiceStatusLabel,
  formatDate,
} from '../../common/utils';
import {
  ACQUISITIONS_UNITS,
  CONFIG_ADJUSTMENTS,
  configAddress,
  VENDORS,
} from '../../common/resources';

import InvoiceForm from '../InvoiceForm';
import {
  invoicesSearchTemplate,
  searchableIndexes,
} from './invoicesListSearchConfig';
import { filterConfig } from './invoicesListFilterConfig';
import Invoice from './Invoice';
import InvoicesListFilters from './InvoicesListFilters';
import { saveInvoice } from './utils';

const visibleColumns = ['vendorInvoiceNo', 'vendor', 'invoiceDate', 'status', 'total'];
const columnMapping = {
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.invoice.list.vendorInvoiceNo" />,
  vendor: <FormattedMessage id="ui-invoice.invoice.list.vendor" />,
  invoiceDate: <FormattedMessage id="ui-invoice.invoice.list.invoiceDate" />,
  status: <FormattedMessage id="ui-invoice.invoice.list.status" />,
  total: <FormattedMessage id="ui-invoice.invoice.list.total" />,
};
const baseResultsFormatter = {
  invoiceDate: invoice => formatDate(invoice.invoiceDate),
  status: invoice => <FormattedMessage id={getInvoiceStatusLabel(invoice)} />,
  total: invoice => (
    <AmountWithCurrencyField
      amount={invoice.total}
      currency={invoice.currency}
    />
  ),
};
const getHelperResourcePath = (helper, id) => `${INVOICE_API}/${id}`;

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class InvoicesList extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    okapi: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
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
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            invoicesSearchTemplate,
            {},
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    vendors: VENDORS,
    acqUnits: ACQUISITIONS_UNITS,
    configAddress,
    configAdjustments: CONFIG_ADJUSTMENTS,
  });

  constructor(props, context) {
    super(props, context);
    this.callout = React.createRef();
    this.showToast = showToast.bind(this);
    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
  }

  // eslint-disable-next-line consistent-return
  onCreate = async (invoice) => {
    const { mutator, okapi } = this.props;

    try {
      const { id } = await saveInvoice(
        invoice,
        [],
        mutator.records,
        okapi,
      );

      this.showToast('ui-invoice.invoice.invoiceHasBeenCreated');
      mutator.query.update({
        _path: `/invoice/view/${id}`,
        layer: null,
      });
    } catch (response) {
      this.showToast('ui-invoice.errors.invoiceHasNotBeenCreated', 'error');

      return { id: 'Unable to create invoice' };
    }
  }

  renderFilters = (onChange) => {
    const { resources } = this.props;
    const acqUnits = get(resources, 'acqUnits.records', []);
    const vendors = get(resources, 'vendors.records', []);

    return resources.query
      ? (
        <InvoicesListFilters
          activeFilters={this.getActiveFilters()}
          acqUnits={acqUnits}
          onChange={onChange}
          queryMutator={this.props.mutator.query}
          vendors={vendors}
        />
      )
      : null;
  };

  getTranslateSearchableIndexes() {
    const { intl: { formatMessage } } = this.props;

    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-invoice.search.${index.label}` });

      return { ...index, label };
    });
  }

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
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Invoice}
          onSelectRow={onSelectRow}
          viewRecordPerms="invoice.invoices.item.get"
          newRecordPerms="invoice.invoices.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={{ showToast: this.showToast }}
          stripes={stripes}
          disableRecordCreation={disableRecordCreation}
          browseOnly={browseOnly}
          showSingleResult={showSingleResult}
          editRecordComponent={InvoiceForm}
          newRecordInitialValues={{
            chkSubscriptionOverlap: true,
            currency: 'USD',
            source: sourceValues.user,
          }}
          massageNewRecord={() => null}
          onCreate={this.onCreate}
          searchableIndexes={this.getTranslateSearchableIndexes()}
          renderFilters={this.renderFilters}
          onFilterChange={this.handleFilterChange}
          onChangeIndex={this.changeSearchIndex}
          selectedIndex={get(resources.query, 'qindex')}
          getHelperResourcePath={getHelperResourcePath}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default injectIntl(InvoicesList);
