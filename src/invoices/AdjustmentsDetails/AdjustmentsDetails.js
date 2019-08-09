import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  ADJUSTMENT_PRORATE_LABELS,
  ADJUSTMENT_RELATION_TO_TOTAL_LABELS,
} from '../../common/constants';

const visibleColumns = ['description', 'value', 'prorate', 'relationToTotal'];
const columnMapping = {
  description: <FormattedMessage id="ui-invoice.adjustment.description" />,
  value: <FormattedMessage id="ui-invoice.adjustment.amount" />,
  prorate: <FormattedMessage id="ui-invoice.settings.adjustments.prorate" />,
  relationToTotal: <FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />,
};
const columnWidths = {
  description: '40%',
  value: '20%',
  prorate: '20%',
  relationToTotal: '20%',
};
const resultsFormatter = {
  prorate: d => <FormattedMessage id={ADJUSTMENT_PRORATE_LABELS[d.prorate]} />,
  relationToTotal: d => <FormattedMessage id={ADJUSTMENT_RELATION_TO_TOTAL_LABELS[d.relationToTotal]} />,
};

const AdjustmentsDetails = ({ adjustments }) => {
  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          contentData={adjustments}
          formatter={resultsFormatter}
          visibleColumns={visibleColumns}
        />
      </Col>
    </Row>
  );
};

AdjustmentsDetails.propTypes = {
  adjustments: PropTypes.arrayOf(PropTypes.object),
};

AdjustmentsDetails.defaultProps = {
  adjustments: [],
};

export default AdjustmentsDetails;
