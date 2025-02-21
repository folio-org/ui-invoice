import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  BooleanFilter,
  ExpenseClassFilter,
  FiscalYearFilter,
  FundFilter,
  NumberRangeFilter,
  PluggableOrganizationFilter,
  PluggableUserFilter,
  SourceFilter,
  PAYMENT_METHOD_OPTIONS,
} from '@folio/stripes-acq-components';

import {
  INVOICE_STATUSES_OPTIONS,
} from '../../../common/constants';
import {
  FILTERS,
} from '../constants';
import { BatchGroupFilter } from './BatchGroupFilter';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const InvoicesListFilters = ({
  activeFilters,
  applyFilters,
  disabled,
  funds,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet id="invoice-filters-accordion-set">
      <AcqCheckboxFilter
        id={FILTERS.STATUS}
        activeFilters={activeFilters[FILTERS.STATUS]}
        labelId="ui-invoice.invoice.details.information.status"
        name={FILTERS.STATUS}
        onChange={adaptedApplyFilters}
        options={INVOICE_STATUSES_OPTIONS}
        disabled={disabled}
      />

      <PluggableOrganizationFilter
        id={FILTERS.VENDOR}
        activeFilters={activeFilters[FILTERS.VENDOR]}
        disabled={disabled}
        labelId="ui-invoice.invoice.vendorName"
        name={FILTERS.VENDOR}
        onChange={adaptedApplyFilters}
      />

      <AcqDateRangeFilter
        id={FILTERS.INVOICE_DATE}
        activeFilters={activeFilters[FILTERS.INVOICE_DATE]}
        disabled={disabled}
        labelId="ui-invoice.invoice.details.information.invoiceDate"
        name={FILTERS.INVOICE_DATE}
        onChange={adaptedApplyFilters}
      />
      <AcqUnitFilter
        id={FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        disabled={disabled}
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        disabled={disabled}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={adaptedApplyFilters}
      />
      <AcqDateRangeFilter
        id={FILTERS.PAYMENT_DUE}
        activeFilters={activeFilters[FILTERS.PAYMENT_DUE]}
        disabled={disabled}
        labelId="ui-invoice.invoice.details.information.paymentDue"
        name={FILTERS.PAYMENT_DUE}
        onChange={adaptedApplyFilters}
      />
      <AcqCheckboxFilter
        id={FILTERS.PAYMENT_METHOD}
        activeFilters={activeFilters[FILTERS.PAYMENT_METHOD]}
        disabled={disabled}
        labelId="ui-invoice.invoice.paymentMethod"
        name={FILTERS.PAYMENT_METHOD}
        onChange={adaptedApplyFilters}
        options={PAYMENT_METHOD_OPTIONS}
      />
      <AcqDateRangeFilter
        id={FILTERS.APPROVAL_DATE}
        activeFilters={activeFilters[FILTERS.APPROVAL_DATE]}
        disabled={disabled}
        labelId="ui-invoice.invoice.approvalDate"
        name={FILTERS.APPROVAL_DATE}
        onChange={adaptedApplyFilters}
      />
      <SourceFilter
        activeFilters={activeFilters[FILTERS.SOURCE]}
        disabled={disabled}
        id={FILTERS.SOURCE}
        name={FILTERS.SOURCE}
        onChange={adaptedApplyFilters}
      />
      <BooleanFilter
        activeFilters={activeFilters[FILTERS.EXPORT_TO_ACCOUNTING]}
        disabled={disabled}
        id={FILTERS.EXPORT_TO_ACCOUNTING}
        labelId="ui-invoice.invoice.exportToAccounting"
        name={FILTERS.EXPORT_TO_ACCOUNTING}
        onChange={adaptedApplyFilters}
      />
      <AcqDateRangeFilter
        id={FILTERS.PAYMENT_DATE}
        activeFilters={activeFilters[FILTERS.PAYMENT_DATE]}
        disabled={disabled}
        labelId="ui-invoice.invoice.paymentDate"
        name={FILTERS.PAYMENT_DATE}
        onChange={adaptedApplyFilters}
      />
      <BatchGroupFilter
        id={FILTERS.BATCH_GROUP}
        activeFilters={activeFilters[FILTERS.BATCH_GROUP]}
        labelId="ui-invoice.invoice.details.information.batchGroup"
        name={FILTERS.BATCH_GROUP}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />
      <FundFilter
        activeFilters={activeFilters[FILTERS.FUND_CODE]}
        disabled={disabled}
        id={FILTERS.FUND_CODE}
        name={FILTERS.FUND_CODE}
        onChange={adaptedApplyFilters}
        funds={funds}
      />
      <ExpenseClassFilter
        activeFilters={activeFilters[FILTERS.EXPENSE_CLASS]}
        disabled={disabled}
        id={FILTERS.EXPENSE_CLASS}
        name={FILTERS.EXPENSE_CLASS}
        onChange={adaptedApplyFilters}
      />
      <NumberRangeFilter
        id={FILTERS.LOCK_TOTAL}
        activeFilters={activeFilters[FILTERS.LOCK_TOTAL]}
        disabled={disabled}
        labelId="ui-invoice.invoice.lockTotal"
        name={FILTERS.LOCK_TOTAL}
        onChange={adaptedApplyFilters}
      />
      <NumberRangeFilter
        id={FILTERS.TOTAL_AMOUNT}
        activeFilters={activeFilters[FILTERS.TOTAL_AMOUNT]}
        disabled={disabled}
        labelId="ui-invoice.invoice.totalAmount"
        name={FILTERS.TOTAL_AMOUNT}
        onChange={adaptedApplyFilters}
      />
      <FiscalYearFilter
        id={FILTERS.FISCAL_YEAR}
        activeFilters={activeFilters[FILTERS.FISCAL_YEAR]}
        labelId="ui-invoice.invoice.details.information.fiscalYear"
        name={FILTERS.FISCAL_YEAR}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <PluggableUserFilter
        id={FILTERS.CREATED_BY}
        activeFilters={activeFilters[FILTERS.CREATED_BY]}
        labelId="ui-invoice.filter.createdBy"
        name={FILTERS.CREATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.DATE_CREATED}
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        disabled={disabled}
        labelId="ui-invoice.invoice.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={adaptedApplyFilters}
      />

      <PluggableUserFilter
        id={FILTERS.UPDATED_BY}
        activeFilters={activeFilters[FILTERS.UPDATED_BY]}
        labelId="ui-invoice.filter.updatedBy"
        name={FILTERS.UPDATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.DATE_UPDATED}
        activeFilters={activeFilters[FILTERS.DATE_UPDATED]}
        labelId="ui-invoice.filter.dateUpdated"
        name={FILTERS.DATE_UPDATED}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <PluggableUserFilter
        id={FILTERS.INVOICE_LINE_CREATED_BY}
        activeFilters={activeFilters[FILTERS.INVOICE_LINE_CREATED_BY]}
        labelId="ui-invoice.filter.invoiceLine.createdBy"
        name={FILTERS.INVOICE_LINE_CREATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.INVOICE_LINE_DATE_CREATED}
        activeFilters={activeFilters[FILTERS.INVOICE_LINE_DATE_CREATED]}
        labelId="ui-invoice.filter.invoiceLine.dateCreated"
        name={FILTERS.INVOICE_LINE_DATE_CREATED}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <PluggableUserFilter
        id={FILTERS.INVOICE_LINE_UPDATED_BY}
        activeFilters={activeFilters[FILTERS.INVOICE_LINE_UPDATED_BY]}
        labelId="ui-invoice.filter.invoiceLine.updatedBy"
        name={FILTERS.INVOICE_LINE_UPDATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.INVOICE_LINE_DATE_UPDATED}
        activeFilters={activeFilters[FILTERS.INVOICE_LINE_DATE_UPDATED]}
        labelId="ui-invoice.filter.invoiceLine.dateUpdated"
        name={FILTERS.INVOICE_LINE_DATE_UPDATED}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

    </AccordionSet>
  );
};

InvoicesListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
};

export default InvoicesListFilters;
