import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';

import { useFiscalYear } from '../../hooks';
import { FiscalYearValue } from './FiscalYearValue';

export const FiscalYearValueContainer = ({ fiscalYearId, ...rest }) => {
  const {
    fiscalYear,
    isLoading,
  } = useFiscalYear(fiscalYearId);

  return (
    <FiscalYearValue
      {...rest}
      value={isLoading ? <Loading /> : fiscalYear.code}
    />
  );
};

FiscalYearValueContainer.propTypes = {
  fiscalYearId: PropTypes.string,
};
