import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';

import {
  calculateFundAmount,
  formatDate,
  FUND_DISTR_TYPE,
} from '@folio/stripes-acq-components';

const getExportFundDistributionData = (item, expenseClassMap, invalidReferenceLabel, currency) => (
  item.fundDistributions?.map(fund => {
    const expenseClassName = fund?.expenseClassId
      ? expenseClassMap[fund?.expenseClassId]?.name ?? invalidReferenceLabel
      : '';

    return (
      `"${fund.code || ''}""${expenseClassName}"
      "${fund.value || '0'}${fund.distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}"
      "${calculateFundAmount(fund, item.total || 0, currency)}"`
    );
  }).join(' | ').replace(/\n\s+/g, '')
);

const getExportVendorPrimaryAddress = (vendor = {}) => {
  const primaryAddress = vendor.addresses?.filter(({ isPrimary }) => isPrimary)?.[0];

  return primaryAddress
    ? (
      `"${primaryAddress.addressLine1}""${primaryAddress.addressLine2 || ''}""${primaryAddress.city || ''}""${primaryAddress.state || ''}""${primaryAddress.zipCode || ''}""${primaryAddress.language || ''}"`
    )
    : '';
};

const getExportAddressData = (addressId, addressMap, invalidReferenceLabel) => (
  addressMap[addressId]
    ? `"${addressMap[addressId].name}""${addressMap[addressId].address}"`
    : invalidReferenceLabel
);

const getExportReferenceNumbers = (line) => (
  line.referenceNumbers?.map(({ refNumber, refNumberType }) => (
    `"${refNumber}""${refNumberType}"`
  )).join(' | ')
);

const getExportAdjustmentData = (adjustments) => (
  adjustments?.map(adj => (
    `"${adj.description || ''}""${adj.value || '0'}${adj.type === FUND_DISTR_TYPE.percent ? '%' : ''}""${adj.prorate || ''}"
    "${adj.relationToTotal || ''}""${Boolean(adj.exportToAccounting)}"`
  )).join(' | ').replace(/\n\s+/g, '')
);

const getInvoiceExportData = ({
  acqUnitMap,
  addressMap,
  batchGroupMap,
  expenseClassMap,
  fiscalYearMap,
  intl,
  invoice,
  invoiceLines,
  invalidReferenceLabel,
  userMap,
  vendorMap,
  voucherLines,
  vouchers,
}) => {
  const voucher = vouchers.find(({ invoiceId }) => invoiceId === invoice.id) || {};
  const voucherLine = voucherLines.find(({ voucherId }) => voucherId === voucher.id) || {};
  const totalUnits = invoiceLines?.reduce((total, { quantity }) => (total + +quantity), 0) ?? 0;

  return {
    subTotal: invoice.subTotal,
    adjustmentsTotal: invoice.adjustmentsTotal,
    totalAmount: invoice.total,
    lockTotal: invoice.lockTotal,
    invoiceFundDistributions: getExportFundDistributionData(
      invoice.adjustments,
      expenseClassMap,
      invalidReferenceLabel,
      invoice.currency,
    ),
    invoiceAdjustments: getExportAdjustmentData(invoice.adjustments),
    accountingCode: invoice.accountingCode,
    vendorAddress: getExportVendorPrimaryAddress(vendorMap[invoice.vendorId]),
    paymentMethod: invoice.paymentMethod,
    chkSubscriptionOverlap: invoice.chkSubscriptionOverlap,
    exportToAccounting: invoice.exportToAccounting,
    enclosureNeeded: invoice.enclosureNeeded,
    currency: invoice.currency,
    exchangeRate: invoice.exchangeRate,
    invoiceTags: invoice.tags?.tagList?.join(' | '),
    voucherNumber: invoice.voucherNumber,
    vendorInvoiceNo: invoice.vendorInvoiceNo,
    vendorCode: vendorMap[invoice.vendorId]?.code ?? invalidReferenceLabel,
    status: invoice.status,
    fiscalYear: fiscalYearMap[invoice.fiscalYearId]?.code,
    invoiceDate: formatDate(invoice.invoiceDate, intl),
    paymentDue: formatDate(invoice.paymentDue, intl),
    approvalDate: formatDate(invoice.approvalDate, intl),
    approvedBy: userMap[invoice.approvedBy]?.username,
    paymentTerms: invoice.paymentTerms,
    acqUnitIds: invoice.acqUnitIds?.map(id => acqUnitMap[id]?.name).filter(Boolean).join(' | '),
    note: invoice.note,
    billTo: invoice.billTo && getExportAddressData(invoice.billTo, addressMap, invalidReferenceLabel),
    batchGroup: batchGroupMap[invoice.batchGroupId]?.name ?? invalidReferenceLabel,
    paymentDate: formatDate(invoice.paymentDate, intl),
    totalUnits,
    externalAccountNumber: voucherLine.externalAccountNumber,
    voucherStatus: voucher.status,
    voucherDate: formatDate(voucher.voucherDate, intl),
    disbursementNumber: voucher.disbursementNumber,
    disbursementDate: formatDate(voucher.disbursementDate, intl),
  };
};

function getInvoiceLineExportData({
  expenseClassMap,
  intl,
  invalidReferenceLabel,
  invoice,
  invoiceLine: line,
  poLineMap,
}) {
  return {
    invoiceLineNumber: line.invoiceLineNumber,
    description: line.description,
    poLineNumber: poLineMap[line.poLineId]?.poLineNumber,
    subscriptionInfo: line.subscriptionInfo,
    subscriptionStart: formatDate(line.subscriptionStart, intl),
    subscriptionEnd: formatDate(line.subscriptionEnd, intl),
    comment: line.comment,
    accountNumber: line.accountNumber,
    lineAccountingCode: line.accountingCode,
    quantity: line.quantity,
    lineSubTotal: line.subTotal,
    lineAdjustments: getExportAdjustmentData(line.adjustments),
    total: line.total,
    lineFundDistributions: getExportFundDistributionData(
      line,
      expenseClassMap,
      invalidReferenceLabel,
      invoice.currency,
    ),
    referenceNumbers: getExportReferenceNumbers(line),
    lineTags: line.tags?.tagList?.join(' | '),
  };
}

const buildExportRow = ({
  acqUnitMap,
  addressMap,
  batchGroupMap,
  expenseClassMap,
  fiscalYearMap,
  intl,
  invoice,
  invoiceLine,
  invoiceLines,
  poLineMap,
  userMap,
  vendorMap,
  voucherLines,
  vouchers,
}) => {
  const invalidReferenceLabel = intl.formatMessage({ id: 'stripes-acq-components.invalidReference' });

  const invoiceExportData = getInvoiceExportData({
    acqUnitMap,
    addressMap,
    batchGroupMap,
    expenseClassMap,
    fiscalYearMap,
    intl,
    invoice,
    invoiceLines,
    invalidReferenceLabel,
    userMap,
    vendorMap,
    voucherLines,
    vouchers,
  });

  const invoiceLineExportData = invoiceLine
    ? getInvoiceLineExportData({
      expenseClassMap,
      intl,
      invalidReferenceLabel,
      invoice,
      invoiceLine,
      poLineMap,
    })
    : {};

  return {
    ...invoiceExportData,
    ...invoiceLineExportData,
  };
};

const buildInvoiceExportRows = ({
  intl,
  invoice,
  invoiceLines: _invoiceLines,
  ...params
}) => {
  const invoiceLinesGroupedByInvoice = groupBy(_invoiceLines, 'invoiceId');
  const invoiceLines = invoiceLinesGroupedByInvoice[invoice.id];

  const buildRow = (invoiceLine) => buildExportRow({
    intl,
    invoice,
    invoiceLine,
    invoiceLines,
    ...params,
  });

  return invoiceLines?.length
    ? invoiceLines.map(buildRow)
    : [buildRow()];
};

export const createExportReport = ({
  acqUnitMap,
  addressMap,
  batchGroupMap,
  expenseClassMap,
  fiscalYearMap,
  intl,
  invoices = [],
  invoiceLines = [],
  poLineMap,
  userMap,
  vendorMap,
  voucherLines = [],
  vouchers = [],
}) => {
  const exportRows = invoices.map(invoice => buildInvoiceExportRows({
    acqUnitMap,
    addressMap,
    batchGroupMap,
    expenseClassMap,
    fiscalYearMap,
    invoice,
    intl,
    invoiceLines,
    poLineMap,
    userMap,
    vendorMap,
    voucherLines,
    vouchers,
  }));

  return flatten(exportRows);
};
