import PropTypes from 'prop-types';

import { FundDistributionView } from '@folio/stripes-acq-components';

import { FUND_DISTRIBUTION_VISIBLE_COLUMNS } from '../../constants';

export const VersionHistoryFundDistributions = ({ version }) => {
  return (
    <FundDistributionView
      name="fundDistributions"
      currency={version?.currency}
      fundDistributions={version?.fundDistributions}
      totalAmount={version?.total}
      mclProps={{
        visibleColumns: FUND_DISTRIBUTION_VISIBLE_COLUMNS,
      }}
    />
  );
};

VersionHistoryFundDistributions.propTypes = {
  version: PropTypes.object.isRequired,
};
