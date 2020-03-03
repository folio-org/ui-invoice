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
  acqUnitsShape,
  BooleanFilter,
  OrganizationFilter,
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
  acqUnits,
  activeFilters,
  applyFilters,
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
      />

      <PluggableOrganizationFilter
        id={FILTERS.VENDOR}
        activeFilters={activeFilters[FILTERS.VENDOR]}
        labelId="ui-invoice.invoice.vendorName"
        name={FILTERS.VENDOR}
        onChange={adaptedApplyFilters}
      />

      <AcqDateRangeFilter
        id={FILTERS.DATE_CREATED}
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        labelId="ui-invoice.invoice.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={adaptedApplyFilters}
      />
      <AcqDateRangeFilter
        id={FILTERS.INVOICE_DATE}
        activeFilters={activeFilters[FILTERS.INVOICE_DATE]}
        labelId="ui-invoice.invoice.details.information.invoiceDate"
        name={FILTERS.INVOICE_DATE}
        onChange={adaptedApplyFilters}
      />
      <AcqUnitFilter
        id={FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-invoice.invoice.acquisitionsUnit"
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
        acqUnits={acqUnits}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={adaptedApplyFilters}
      />
      <AcqDateRangeFilter
        id={FILTERS.PAYMENT_DUE}
        activeFilters={activeFilters[FILTERS.PAYMENT_DUE]}
        labelId="ui-invoice.invoice.details.information.paymentDue"
        name={FILTERS.PAYMENT_DUE}
        onChange={adaptedApplyFilters}
      />
      <AcqCheckboxFilter
        id={FILTERS.PAYMENT_METHOD}
        activeFilters={activeFilters[FILTERS.PAYMENT_METHOD]}
        labelId="ui-invoice.invoice.paymentMethod"
        name={FILTERS.PAYMENT_METHOD}
        onChange={adaptedApplyFilters}
        options={PAYMENT_METHOD_OPTIONS}
      />
      <AcqDateRangeFilter
        id={FILTERS.APPROVAL_DATE}
        activeFilters={activeFilters[FILTERS.APPROVAL_DATE]}
        labelId="ui-invoice.invoice.approvalDate"
        name={FILTERS.APPROVAL_DATE}
        onChange={adaptedApplyFilters}
      />
      <SourceFilter
        activeFilters={activeFilters[FILTERS.SOURCE]}
        id={FILTERS.SOURCE}
        name={FILTERS.SOURCE}
        onChange={adaptedApplyFilters}
      />
      <BooleanFilter
        activeFilters={activeFilters[FILTERS.EXPORT_TO_ACCOUNTING]}
        id={FILTERS.EXPORT_TO_ACCOUNTING}
        labelId="ui-invoice.invoice.exportToAccounting"
        name={FILTERS.EXPORT_TO_ACCOUNTING}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

InvoicesListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  acqUnits: acqUnitsShape,
};

InvoicesListFilters.defaultProps = {
  acqUnits: [],
};

export default InvoicesListFilters;
