import moment from 'moment';

import { DATE_FORMAT } from '../constants';

export const getInvoiceStatusLabel = ({ status = '' }) => (
  `ui-invoice.invoice.status.${(status || '').toLowerCase()}`
);

export const formatAmount = (amount = '') => `$${amount.toLocaleString('en')}`;

export const formatDate = (dateString) => {
  const date = moment.utc(dateString || '');

  return date.isValid() ? date.format(DATE_FORMAT) : '';
};
