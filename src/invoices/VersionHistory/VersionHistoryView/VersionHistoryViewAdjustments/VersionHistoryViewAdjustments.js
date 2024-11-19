import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FrontendSortingMCL,
  VersionKeyValue,
} from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_LABELS,
  ADJUSTMENT_RELATION_TO_TOTAL_LABELS,
  ADJUSTMENT_TYPE_VALUES,
} from '../../../../common/constants';
import {
  COLUMN_MAPPING,
  SORTED_COLUMN,
  SORTERS, VISIBLE_COLUMNS,
} from './constants';

export const VersionHistoryViewAdjustments = ({ adjustments, currency }) => {
  const resultsFormatter = {
    description: ({ rowIndex, description }) => (
      <VersionKeyValue
        name={`adjustments[${rowIndex}].description`}
        value={description}
      />),
    value: ({ rowIndex, type, value }) => (
      <VersionKeyValue
        name={`adjustments[${rowIndex}].value`}
        value={(
          type === ADJUSTMENT_TYPE_VALUES.amount
            ? (
              <AmountWithCurrencyField
                amount={value}
                currency={currency}
              />
            )
            : `${value}%`
        )}
      />),
    prorate: ({ prorate, rowIndex }) => (
      <VersionKeyValue
        name={`adjustments[${rowIndex}].prorate`}
        value={prorate && <FormattedMessage id={ADJUSTMENT_PRORATE_LABELS[prorate]} />}
      />
    ),
    relationToTotal: ({ relationToTotal, rowIndex }) => (
      <VersionKeyValue
        name={`adjustments[${rowIndex}].relationToTotal`}
        value={relationToTotal && <FormattedMessage id={ADJUSTMENT_RELATION_TO_TOTAL_LABELS[relationToTotal]} />}
      />
    ),
  };

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
