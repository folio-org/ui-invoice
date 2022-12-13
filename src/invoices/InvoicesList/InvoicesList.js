import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  matchPath,
  Route,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  MultiColumnList,
  checkScope,
  HasCommand,
  TextLink,
} from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FiltersPane,
  handleKeyCommand,
  NoResultsMessage,
  PrevNextPagination,
  ResetButton,
  RESULT_COUNT_INCREMENT,
  ResultsPane,
  SingleSearchForm,
  useFiltersReset,
  useFiltersToogle,
  useFunds,
  useItemToView,
  useLocationFilters,
  useLocationSorting,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  getInvoiceStatusLabel,
  formatDate,
} from '../../common/utils';

import { InvoiceDetailsContainer } from '../InvoiceDetails';
import { InvoiceLineDetailsContainer } from '../InvoiceLineDetails';

import InvoicesListFilters from './InvoicesListFilters';
import { InvoicesListLastMenu } from './InvoicesListLastMenu';
import {
  searchableIndexes,
} from './InvoicesListSearchConfig';
import { ExportSettingsModal } from './ExportSettingsModal';

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

const getResultsFormatter = ({ search }) => ({
  vendorInvoiceNo: invoice => <TextLink to={`/invoice/view/${invoice.id}${search}`}>{invoice.vendorInvoiceNo}</TextLink>,
  vendor: invoice => invoice?.vendor?.code,
  invoiceDate: invoice => formatDate(invoice.invoiceDate),
  status: invoice => <FormattedMessage id={getInvoiceStatusLabel(invoice)} />,
  invoiceTotal: invoice => (
    <AmountWithCurrencyField
      amount={invoice.total}
      currency={invoice.currency}
    />
  ),
});

const InvoicesList = ({
  isLoading,
  onNeedMoreData,
  resetData,
  invoices,
  invoicesCount,
  pagination,
  refreshList,
  query,
}) => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
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
  const { funds } = useFunds();
  const [isExportModalOpened, toggleExportModal] = useModalToggle();

  useFiltersReset(resetFilters);

  const renderActionMenu = useCallback(({ onToggle }) => (
    <InvoicesListLastMenu
      onToggle={onToggle}
      invoicesCount={invoicesCount}
      toggleExportModal={toggleExportModal}
    />
  ), [invoicesCount, toggleExportModal]);

  const urlParams = useMemo(() => (
    matchPath(location.pathname, { path: `${match.path}/view/:id` })
  ), [location.pathname, match.path]);

  const isRowSelected = useCallback(({ item }) => {
    return urlParams && (urlParams.params.id === item.id);
  }, [urlParams]);

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

  const renderInvoiceDetails = useCallback((props) => (
    <InvoiceDetailsContainer
      {...props}
      refreshList={refreshList}
    />
  ), [refreshList]);

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
              funds={funds}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="invoice-results-pane"
          autosize
          title={resultsPaneTitle}
          count={invoicesCount}
          renderActionMenu={renderActionMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {({ height, width }) => (
            <>
              <MultiColumnList
                id="invoices-list"
                totalCount={invoicesCount}
                contentData={invoices}
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                formatter={getResultsFormatter(location)}
                loading={isLoading}
                onNeedMoreData={onNeedMoreData}
                sortOrder={sortingField}
                sortDirection={sortingDirection}
                onHeaderClick={changeSorting}
                pagingType="none"
                isEmptyMessage={resultsStatusMessage}
                isSelected={isRowSelected}
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

        {isExportModalOpened && (
          <ExportSettingsModal
            onCancel={toggleExportModal}
            query={query}
          />
        )}

        <Route
          path="/invoice/view/:id/line/:lineId/view"
          component={InvoiceLineDetailsContainer}
        />

        <Route
          path="/invoice/view/:id"
          exact
          render={renderInvoiceDetails}
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
  query: PropTypes.string,
};

InvoicesList.defaultProps = {
  invoicesCount: 0,
  isLoading: false,
  invoices: [],
};

export default InvoicesList;
