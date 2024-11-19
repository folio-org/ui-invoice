import PropTypes from 'prop-types';
import { useMemo } from 'react';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { FrontendSortingMCL } from '@folio/stripes-acq-components';

import {
  COLUMN_MAPPING,
  SORTED_COLUMN,
  SORTERS, VISIBLE_COLUMNS,
} from './constants';
import { getResultsFormatter } from './utils';

export const VersionHistoryViewAdjustments = ({ adjustments, currency }) => {
  const resultsFormatter = useMemo(() => getResultsFormatter({ currency }), [currency]);

  return (
    <Row>
      <Col xs={12}>
        <FrontendSortingMCL
          columnMapping={COLUMN_MAPPING}
          contentData={adjustments}
          formatter={resultsFormatter}
          id="invoice-adjustments-list"
          sortedColumn={SORTED_COLUMN}
          sorters={SORTERS}
          visibleColumns={VISIBLE_COLUMNS}
          columnIdPrefix="adjustments"
        />
      </Col>
    </Row>
  );
};

VersionHistoryViewAdjustments.propTypes = {
  adjustments: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};
