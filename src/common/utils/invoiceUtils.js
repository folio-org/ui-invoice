export const getInvoiceStatusLabel = ({ status = '' }) => (
  `ui-invoice.invoice.status.${(status || '').toLowerCase()}`
);

export const formatAmount = (amount = '') => `$${amount.toLocaleString('en')}`;
