import { FormattedMessage } from 'react-intl';

export const SORTED_COLUMN = 'description';
export const VISIBLE_COLUMNS = ['description', 'value', 'prorate', 'relationToTotal'];
export const SORTERS = { description: ({ description }) => description?.toLowerCase() };

export const COLUMN_MAPPING = {
  description: <FormattedMessage id="ui-invoice.adjustment.description" />,
  value: <FormattedMessage id="ui-invoice.adjustment.value" />,
  prorate: <FormattedMessage id="ui-invoice.settings.adjustments.prorate" />,
  relationToTotal: <FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />,
};
