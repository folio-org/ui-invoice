export const VENDOR_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
};

export const ACQ_ERROR_TYPE = {
  order: 'order',
};

export const INVOICE_OMITTED_FIELDS = [
  'approvalDate',
  'approvedBy',
  'documents',
  'fiscalYearId',
  'id',
  'links',
  'metadata',
  'paymentDate',
  'status',
  'voucherNumber',
];
export const PO_LINE_PAYMENT_STATUS = {
  NO_CHANGE: 'noChange',
  AWAITING_PAYMENT: 'awaitingPayment',
  PARTIALLY_PAID: 'partiallyPaid',
  FULLY_PAID: 'fullyPaid',
  CANCELLED: 'cancelled',
};

export const PO_LINE_PAYMENT_STATUSES = [
  PO_LINE_PAYMENT_STATUS.NO_CHANGE,
  PO_LINE_PAYMENT_STATUS.AWAITING_PAYMENT,
  PO_LINE_PAYMENT_STATUS.PARTIALLY_PAID,
  PO_LINE_PAYMENT_STATUS.FULLY_PAID,
  PO_LINE_PAYMENT_STATUS.CANCELLED,
];

export const PO_LINE_PAYMENT_STATUS_LABELS = {
  [PO_LINE_PAYMENT_STATUS.NO_CHANGE]: 'No Change',
  [PO_LINE_PAYMENT_STATUS.AWAITING_PAYMENT]: 'Awaiting Payment',
  [PO_LINE_PAYMENT_STATUS.PARTIALLY_PAID]: 'Partially Paid',
  [PO_LINE_PAYMENT_STATUS.FULLY_PAID]: 'Fully Paid',
  [PO_LINE_PAYMENT_STATUS.CANCELLED]: 'Cancelled',
};

export const ORDER_TYPE = {
  ONE_TIME: 'One-Time',
  ONGOING: 'Ongoing',
};
