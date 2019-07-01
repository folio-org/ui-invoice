import moment from 'moment';

import {
  DATE_FORMAT,
  POST_APPROVAL_STATUSES,
} from '../constants';

export const getInvoiceStatusLabel = ({ status = '' }) => (
  `ui-invoice.invoice.status.${(status || '').toLowerCase()}`
);

export const formatAmount = (amount = '') => `$${amount.toLocaleString('en')}`;

export const formatDate = (dateString) => {
  const date = moment.utc(dateString || '');

  return date.isValid() ? date.format(DATE_FORMAT) : '';
};

export const IS_EDIT_POST_APPROVAL = (id, status) => {
  return Boolean(id && POST_APPROVAL_STATUSES.includes(status));
};
