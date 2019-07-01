export const DATE_FORMAT = 'MM/DD/YYYY';
export const CONFIG_MODULE_TENANT = 'TENANT';
export const LIMIT_MAX = 2147483647;
export const ORGANIZATION_STATUS_ACTIVE = 'Active';

export const INVOICE_STATUS = {
  open: 'Open',
  approved: 'Approved',
  paid: 'Paid',
  cancelled: 'Cancelled',
  reviewed: 'Reviewed',
};

export const INVOICE_STATUSES_OPTIONS = [
  { label: 'Open', value: INVOICE_STATUS.open },
  { label: 'Reviewed', value: INVOICE_STATUS.reviewed },
  { label: 'Approved', value: INVOICE_STATUS.approved },
  { label: 'Paid', value: INVOICE_STATUS.paid },
  { label: 'Cancelled', value: INVOICE_STATUS.cancelled },
];

export const POST_APPROVAL_STATUSES = [INVOICE_STATUS.approved, INVOICE_STATUS.paid, INVOICE_STATUS.cancelled];
