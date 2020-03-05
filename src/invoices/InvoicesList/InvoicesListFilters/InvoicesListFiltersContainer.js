import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  ACQUISITIONS_UNITS,
} from '../../../common/resources';
import InvoicesListFilters from './InvoicesListFilters';

const InvoicesListFiltersContainer = ({ resources, activeFilters, applyFilters }) => {
  const acqUnits = get(resources, 'invoiceListFilterAcqUnits.records', []);

  return (
    <InvoicesListFilters
      acqUnits={acqUnits}
      activeFilters={activeFilters}
      applyFilters={applyFilters}
    />
  );
};

InvoicesListFiltersContainer.manifest = Object.freeze({
  invoiceListFilterAcqUnits: ACQUISITIONS_UNITS,
});

InvoicesListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(InvoicesListFiltersContainer);
