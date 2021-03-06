import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  BooleanFilter,
  PluggableOrganizationFilter,
  SourceFilter,
  PAYMENT_METHOD_OPTIONS,
} from '@folio/stripes-acq-components';

import {
  INVOICE_STATUSES_OPTIONS,
} from '../../../common/constants';
import {
  FILTERS,
} from '../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const InvoicesListFilters = ({
  activeFilters,
  applyFilters,
  disabled,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
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
        id={FILTERS.DATE_CREATED}
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        disabled={disabled}
        labelId="ui-invoice.invoice.dateCreated"
        name={FILTERS.DATE_CREATED}
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
        labelId="ui-invoice.invoice.acquisitionsUnit"
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
    </AccordionSet>
  );
};

InvoicesListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default InvoicesListFilters;
