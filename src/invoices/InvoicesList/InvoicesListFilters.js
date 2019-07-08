import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  AcqUnitFilter,
  acqUnitsShape,
  BooleanFilter,
  OrganizationFilter,
  organizationsShape,
  SourceFilter,
} from '@folio/stripes-acq-components';

import {
  INVOICE_STATUSES_OPTIONS,
  PAYMENT_METHODS_OPTIONS,
} from '../../common/constants';
import {
  FILTERS,
} from './constants';

class InvoicesListFilters extends Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    acqUnits: acqUnitsShape,
    onChange: PropTypes.func.isRequired,
    vendors: organizationsShape,
    init: PropTypes.func,
  };

  static defaultProps = {
    activeFilters: {},
    init: noop,
  };

  componentDidMount() {
    this.props.init();
  }

  render() {
    const { activeFilters, acqUnits, onChange, vendors } = this.props;

    return (
      <AccordionSet>
        <OrganizationFilter
          id={FILTERS.VENDOR}
          activeFilters={activeFilters[FILTERS.VENDOR]}
          labelId="ui-invoice.invoice.vendorName"
          name={FILTERS.VENDOR}
          onChange={onChange}
          organizations={vendors}
        />
        <AcqDateRangeFilter
          id={FILTERS.DATE_CREATED}
          activeFilters={activeFilters[FILTERS.DATE_CREATED]}
          labelId="ui-invoice.invoice.dateCreated"
          name={FILTERS.DATE_CREATED}
          onChange={onChange}
        />
        <AcqDateRangeFilter
          id={FILTERS.INVOICE_DATE}
          activeFilters={activeFilters[FILTERS.INVOICE_DATE]}
          labelId="ui-invoice.invoice.details.information.invoiceDate"
          name={FILTERS.INVOICE_DATE}
          onChange={onChange}
        />
        <AcqUnitFilter
          id={FILTERS.ACQUISITIONS_UNIT}
          activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
          labelId="ui-invoice.invoice.acquisitionsUnit"
          name={FILTERS.ACQUISITIONS_UNIT}
          onChange={onChange}
          acqUnits={acqUnits}
        />
        <AcqDateRangeFilter
          id={FILTERS.PAYMENT_DUE}
          activeFilters={activeFilters[FILTERS.PAYMENT_DUE]}
          labelId="ui-invoice.invoice.details.information.paymentDue"
          name={FILTERS.PAYMENT_DUE}
          onChange={onChange}
        />
        <AcqCheckboxFilter
          id={FILTERS.PAYMENT_METHOD}
          activeFilters={activeFilters[FILTERS.PAYMENT_METHOD]}
          labelId="ui-invoice.invoice.paymentMethod"
          name={FILTERS.PAYMENT_METHOD}
          onChange={onChange}
          options={PAYMENT_METHODS_OPTIONS}
        />
        <AcqDateRangeFilter
          id={FILTERS.APPROVAL_DATE}
          activeFilters={activeFilters[FILTERS.APPROVAL_DATE]}
          labelId="ui-invoice.invoice.approvalDate"
          name={FILTERS.APPROVAL_DATE}
          onChange={onChange}
        />
        <AcqCheckboxFilter
          id={FILTERS.STATUS}
          activeFilters={activeFilters[FILTERS.STATUS]}
          labelId="ui-invoice.invoice.details.information.status"
          name={FILTERS.STATUS}
          onChange={onChange}
          options={INVOICE_STATUSES_OPTIONS}
        />
        <SourceFilter
          activeFilters={activeFilters[FILTERS.SOURCE]}
          id={FILTERS.SOURCE}
          name={FILTERS.SOURCE}
          onChange={onChange}
        />
        <BooleanFilter
          activeFilters={activeFilters[FILTERS.EXPORT_TO_ACCOUNTING]}
          id={FILTERS.EXPORT_TO_ACCOUNTING}
          labelId="ui-invoice.invoice.exportToAccounting"
          name={FILTERS.EXPORT_TO_ACCOUNTING}
          onChange={onChange}
        />
      </AccordionSet>
    );
  }
}

export default InvoicesListFilters;
