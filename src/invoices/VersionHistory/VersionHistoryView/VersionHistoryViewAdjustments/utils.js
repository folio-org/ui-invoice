import { FormattedMessage } from 'react-intl';

import {
  AmountWithCurrencyField,
  VersionKeyValue,
} from '@folio/stripes-acq-components';

import {
  ADJUSTMENT_PRORATE_LABELS,
  ADJUSTMENT_RELATION_TO_TOTAL_LABELS,
  ADJUSTMENT_TYPE_VALUES,
} from '../../../../common/constants';

export const getResultsFormatter = ({ currency }) => ({
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
});
