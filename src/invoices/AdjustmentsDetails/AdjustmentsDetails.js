import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FrontendSortingMCL,
} from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_LABELS,
  ADJUSTMENT_RELATION_TO_TOTAL_LABELS,
  ADJUSTMENT_TYPE_VALUES,
} from '../../common/constants';

const sortedColumn = 'description';
const visibleColumns = ['description', 'value', 'prorate', 'relationToTotal'];
const columnMapping = {
  description: <FormattedMessage id="ui-invoice.adjustment.description" />,
  value: <FormattedMessage id="ui-invoice.adjustment.amount" />,
  prorate: <FormattedMessage id="ui-invoice.settings.adjustments.prorate" />,
  relationToTotal: <FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />,
};

const SORTERS = { description: ({ description }) => description?.toLowerCase() };

const AdjustmentsDetails = ({ adjustments, currency }) => {
  const resultsFormatter = {
    value: d => (
      d.type === ADJUSTMENT_TYPE_VALUES.amount
        ? (
          <AmountWithCurrencyField
            amount={d.value}
            currency={currency}
          />
        )
        : `${d.value}%`
    ),
    prorate: d => d.prorate && <FormattedMessage id={ADJUSTMENT_PRORATE_LABELS[d.prorate]} />,
    relationToTotal: d => <FormattedMessage id={ADJUSTMENT_RELATION_TO_TOTAL_LABELS[d.relationToTotal]} />,
  };

  return (
    <Row>
      <Col xs={12}>
        <FrontendSortingMCL
          columnMapping={columnMapping}
          contentData={adjustments}
          formatter={resultsFormatter}
          id="invoice-lines-adjustments-list"
          sortedColumn={sortedColumn}
          sorters={SORTERS}
          visibleColumns={visibleColumns}
          columnIdPrefix="adjustments"
        />
      </Col>
    </Row>
  );
};

AdjustmentsDetails.propTypes = {
  adjustments: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

export default AdjustmentsDetails;
