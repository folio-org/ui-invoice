import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { SearchAndSort } from '@folio/stripes/smart-components';

import packageInfo from '../../../package';
import {
  INVOICES_LIST_API,
} from '../../common/constants';

const filterConfig = [];
const visibleColumns = ['vendorInvoiceNo'];

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class InvoicesList extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    disableRecordCreation: PropTypes.bool,
    showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
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
      path: INVOICES_LIST_API,
      perRequest: RESULT_COUNT_INCREMENT,
    },
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
          viewRecordComponent={noop}
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
