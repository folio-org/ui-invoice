import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FiltersPane,
  ResultsPane,
  ResetButton,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
  useToggle,
} from '@folio/stripes-acq-components';

import {
  getInvoiceStatusLabel,
  formatDate,
} from '../../common/utils';

import { InvoiceDetailsContainer } from '../InvoiceDetails';
import { InvoiceLineDetailsContainer } from '../InvoiceLineDetails';

import { InvoicesListFiltersContainer } from './InvoicesListFilters';
import InvoicesListLastMenu from './InvoicesListLastMenu';
import {
  searchableIndexes,
} from './InvoicesListSearchConfig';

const resultsPaneTitle = <FormattedMessage id="ui-invoice.meta.title" />;
const visibleColumns = ['vendorInvoiceNo', 'vendor', 'invoiceDate', 'status', 'total'];
const columnMapping = {
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.invoice.list.vendorInvoiceNo" />,
  vendor: <FormattedMessage id="ui-invoice.invoice.list.vendor" />,
  invoiceDate: <FormattedMessage id="ui-invoice.invoice.list.invoiceDate" />,
  status: <FormattedMessage id="ui-invoice.invoice.list.status" />,
  total: <FormattedMessage id="ui-invoice.invoice.list.total" />,
};
const sortableFields = ['vendorInvoiceNo', 'invoiceDate', 'status', 'total'];
const resultsFormatter = {
  vendor: invoice => invoice?.vendor?.name,
  invoiceDate: invoice => formatDate(invoice.invoiceDate),
  status: invoice => <FormattedMessage id={getInvoiceStatusLabel(invoice)} />,
  total: invoice => (
    <AmountWithCurrencyField
      amount={invoice.total}
      currency={invoice.currency}
    />
  ),
};

const InvoicesList = ({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  invoices,
  invoicesCount,
}) => {
  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableFields);
  const [isFiltersOpened, toggleFilters] = useToggle(true);

  const renderLastMenu = useCallback(() => <InvoicesListLastMenu />, []);

  const selecteInvoice = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/invoice/view/${id}`,
        search: location.search,
      });
    },
    [history, location.search],
  );

  return (
    <Paneset data-test-invoices-list>
      {isFiltersOpened && (
        <FiltersPane>
          <SingleSearchForm
            applySearch={applySearch}
            changeSearch={changeSearch}
            searchQuery={searchQuery}
            isLoading={isLoading}
            ariaLabelId="ui-invoice.search"
            searchableIndexes={searchableIndexes}
            changeSearchIndex={changeIndex}
            selectedIndex={searchIndex}
          />

          <ResetButton
            id="reset-invoice-filters"
            reset={resetFilters}
            disabled={!location.search}
          />

          <InvoicesListFiltersContainer
            activeFilters={filters}
            applyFilters={applyFilters}
          />
        </FiltersPane>
      )}

      <ResultsPane
        title={resultsPaneTitle}
        count={invoicesCount}
        renderLastMenu={renderLastMenu}
        toggleFiltersPane={toggleFilters}
      >
        <MultiColumnList
          id="invocies-list"
          totalCount={invoicesCount}
          contentData={invoices}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          formatter={resultsFormatter}
          loading={isLoading}
          autosize
          virtualize
          onNeedMoreData={onNeedMoreData}
          onRowClick={selecteInvoice}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
        />
      </ResultsPane>

      <Route
        path="/invoice/view/:id/line/:lineId/view"
        component={InvoiceLineDetailsContainer}
      />

      <Route
        path="/invoice/view/:id"
        component={InvoiceDetailsContainer}
        exact
      />
    </Paneset>
  );
};

InvoicesList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  invoicesCount: PropTypes.number,
  isLoading: PropTypes.bool,
  invoices: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

InvoicesList.defaultProps = {
  invoicesCount: 0,
  isLoading: false,
  invoices: [],
};

export default withRouter(InvoicesList);
