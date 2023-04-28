import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';

import { useFiscalYear } from '../../hooks';
import { FiscalYearValue } from './FiscalYearValue';

export const FiscalYearValueContainer = ({ fiscalYearId }) => {
  const {
    fiscalYear,
    isLoading,
  } = useFiscalYear(fiscalYearId);

  if (isLoading) return <Loading />;

  return (
    <FiscalYearValue value={fiscalYear.code} />
  );
};

FiscalYearValueContainer.propTypes = {
  fiscalYearId: PropTypes.string,
};
