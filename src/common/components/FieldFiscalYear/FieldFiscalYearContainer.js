import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { Loading } from '@folio/stripes/components';

import { usePayableFiscalYears } from '../../hooks';
import { FieldFiscalYear } from './FieldFiscalYear';

export const FieldFiscalYearContainer = ({
  id,
  disabled,
  name,
  required,
}) => {
  const {
    fiscalYears,
    isFetching,
  } = usePayableFiscalYears();

  const dataOptions = useMemo(() => (
    fiscalYears.map(({ code, id: fyId }) => ({ value: fyId, label: code }))
  ), [fiscalYears]);

  if (isFetching) return <Loading />;

  return (
    <FieldFiscalYear
      id={id}
      disabled={disabled}
      name={name}
      dataOptions={dataOptions}
      required={required}
    />
  );
};

FieldFiscalYearContainer.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
};
