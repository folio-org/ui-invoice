import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  MultiColumnList,
  checkScope,
  HasCommand,
} from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FiltersPane,
  handleKeyCommand,
  NoResultsMessage,
  PrevNextPagination,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useFiltersToogle,
  useItemToView,
  useLocationFilters,
  useLocationSorting,
} from '@folio/stripes-acq-components';

import {
  getInvoiceStatusLabel,
  formatDate,
} from '../../common/utils';

import { InvoiceDetailsContainer } from '../InvoiceDetails';
import { InvoiceLineDetailsContainer } from '../InvoiceLineDetails';

import InvoicesListFilters from './InvoicesListFilters';
import InvoicesListLastMenu from './InvoicesListLastMenu';
import {
  searchableIndexes,
} from './InvoicesListSearchConfig';
import { RESULT_COUNT_INCREMENT } from './constants';

const resultsPaneTitle = <FormattedMessage id="ui-invoice.meta.title" />;
const visibleColumns = ['vendorInvoiceNo', 'vendor', 'invoiceDate', 'status', 'invoiceTotal'];
const columnMapping = {
  vendorInvoiceNo: <FormattedMessage id="ui-invoice.invoice.list.vendorInvoiceNo" />,
  vendor: <FormattedMessage id="ui-invoice.invoice.list.vendor" />,
  invoiceDate: <FormattedMessage id="ui-invoice.invoice.list.invoiceDate" />,
  status: <FormattedMessage id="ui-invoice.invoice.list.status" />,
  invoiceTotal: <FormattedMessage id="ui-invoice.invoice.list.total" />,
};
const sortableFields = ['vendorInvoiceNo', 'invoiceDate', 'status', 'invoiceTotal'];
const resultsFormatter = {
  vendor: invoice => invoice?.vendor?.name,
  invoiceDate: invoice => formatDate(invoice.invoiceDate),
  status: invoice => <FormattedMessage id={getInvoiceStatusLabel(invoice)} />,
  invoiceTotal: invoice => (
    <AmountWithCurrencyField
      amount={invoice.total}
      currency={invoice.currency}
    />
  ),
};

const InvoicesList = ({
  isLoading,
  onNeedMoreData,
  resetData,
  invoices,
  invoicesCount,
  pagination,
  refreshList,
}) => {
  const location = useLocation();
  const history = useHistory();
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
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-invoice/filters');
  const stripes = useStripes();
  const { itemToView, setItemToView, deleteItemToView } = useItemToView('invoices-list');

  const renderLastMenu = useCallback(() => <InvoicesListLastMenu />, []);

  const selectInvoice = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/invoice/view/${id}`,
        search: location.search,
      });
    },
    [history, location.search],
  );

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-invoice.invoice.create')) {
          history.push('/invoice/create');
        }
      }),
    },
  ];

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <PersistedPaneset
        appId="ui-receiving"
        id="invoice-paneset"
        data-test-invoices-list
      >
        {isFiltersOpened && (
          <FiltersPane
            id="invoice-filters-pane"
            toggleFilters={toggleFilters}
          >
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
              disabled={!location.search || isLoading}
            />

            <InvoicesListFilters
              activeFilters={filters}
              applyFilters={applyFilters}
              disabled={isLoading}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="invoice-results-pane"
          autosize
          title={resultsPaneTitle}
          count={invoicesCount}
          renderLastMenu={renderLastMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
        >
          {({ height, width }) => (
            <>
              <MultiColumnList
                id="invoices-list"
                totalCount={invoicesCount}
                contentData={invoices}
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                formatter={resultsFormatter}
                loading={isLoading}
                onNeedMoreData={onNeedMoreData}
                onRowClick={selectInvoice}
                sortOrder={sortingField}
                sortDirection={sortingDirection}
                onHeaderClick={changeSorting}
                pagingType="none"
                isEmptyMessage={resultsStatusMessage}
                hasMargin
                pageAmount={RESULT_COUNT_INCREMENT}
                height={height - PrevNextPagination.HEIGHT}
                width={width}
                itemToView={itemToView}
                onMarkPosition={setItemToView}
                onResetMark={deleteItemToView}
              />
              {invoices.length > 0 && (
                <PrevNextPagination
                  {...pagination}
                  totalCount={invoicesCount}
                  disabled={isLoading}
                  onChange={onNeedMoreData}
                />
              )}
            </>
          )}
        </ResultsPane>

        <Route
          path="/invoice/view/:id/line/:lineId/view"
          component={InvoiceLineDetailsContainer}
        />

        <Route
          path="/invoice/view/:id"
          exact
          render={props => (
            <InvoiceDetailsContainer
              {...props}
              refreshList={refreshList}
            />
          )}
        />
      </PersistedPaneset>
    </HasCommand>
  );
};

InvoicesList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  invoicesCount: PropTypes.number,
  isLoading: PropTypes.bool,
  invoices: PropTypes.arrayOf(PropTypes.object),
  refreshList: PropTypes.func.isRequired,
  pagination: PropTypes.object,
};

InvoicesList.defaultProps = {
  invoicesCount: 0,
  isLoading: false,
  invoices: [],
};

export default InvoicesList;
