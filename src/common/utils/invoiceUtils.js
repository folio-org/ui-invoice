import React from 'react';

import { FolioFormattedDate } from '@folio/stripes-acq-components';

import {
  INVOICE_LINE_API,
  INVOICE_STATUS,
  POST_APPROVAL_STATUSES,
} from '../constants';

export const getInvoiceStatusLabel = ({ status = '' }) => (
  `ui-invoice.invoice.status.${(status || '').toLowerCase()}`
);

export const formatDate = (dateString) => <FolioFormattedDate value={dateString} />;

export const IS_EDIT_POST_APPROVAL = (id, status) => {
  return Boolean(id && POST_APPROVAL_STATUSES.includes(status));
};

export const isPayable = (status) => INVOICE_STATUS.approved === status;

export const isPaid = (status) => INVOICE_STATUS.paid === status;

export const isCancelled = (status) => INVOICE_STATUS.cancelled === status;

export const fetchInvoiceLines = async (ky, options) => {
  const { invoiceLines } = await ky.get(INVOICE_LINE_API, { options }).json();

  return invoiceLines;
};
