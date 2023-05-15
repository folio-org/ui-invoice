import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import { SelectionFilter } from '@folio/stripes-acq-components';
import { useFiscalYears } from '../../../../common/hooks';

export const FiscalYearFilter = (props) => {
  const { isLoading, fiscalYears } = useFiscalYears();
  const fiscalYearOptions = useMemo(() => (
    fiscalYears.map(({ code, id: fiscalYearId }) => ({ value: fiscalYearId, label: code }))
  ), [fiscalYears]);

  if (isLoading) return <Loading />;

  return (
    <SelectionFilter
      {...props}
      options={fiscalYearOptions}
    />
  );
};

FiscalYearFilter.propTypes = {
  id: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
