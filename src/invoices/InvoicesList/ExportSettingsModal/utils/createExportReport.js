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

const getInvoiceLineExternalAccountNumbers = (line, fundsMap, invalidReferenceLabel) => {
  return line.fundDistributions?.map(fund => {
    const externalAccountNumber = fundsMap[fund.fundId]?.externalAccountNo;

    return externalAccountNumber ? `"${externalAccountNumber}"` : invalidReferenceLabel;
  }).join(' | ');
};

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
  vouchers,
}) => {
  const voucher = vouchers.find(({ invoiceId }) => invoiceId === invoice.id) || {};
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
    voucherStatus: voucher.status,
    voucherDate: formatDate(voucher.voucherDate, intl),
    disbursementNumber: voucher.disbursementNumber,
    disbursementDate: formatDate(voucher.disbursementDate, intl),
    createdBy: userMap[invoice.metadata?.createdByUserId]?.username,
    dateCreated: formatDate(invoice.metadata?.createdDate, intl),
    updatedBy: userMap[invoice.metadata?.updatedByUserId]?.username,
    dateUpdated: formatDate(invoice.metadata?.updatedDate, intl),
  };
};

function getInvoiceLineExportData({
  expenseClassMap,
  fundsMap,
  intl,
  invalidReferenceLabel,
  invoice,
  invoiceLine: line,
  poLineMap,
  userMap,
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
    externalAccountNumber: getInvoiceLineExternalAccountNumbers(line, fundsMap, invalidReferenceLabel),
    referenceNumbers: getExportReferenceNumbers(line),
    lineTags: line.tags?.tagList?.join(' | '),
    invoiceLineCreatedBy: userMap[line.metadata?.createdByUserId]?.username,
    invoiceLineDateCreated: formatDate(line.metadata?.createdDate, intl),
    invoiceLineUpdatedBy: userMap[line.metadata?.updatedByUserId]?.username,
    invoiceLineDateUpdated: formatDate(line.metadata?.updatedDate, intl),
  };
}

const buildExportRow = ({
  acqUnitMap,
  addressMap,
  batchGroupMap,
  expenseClassMap,
  fiscalYearMap,
  fundsMap,
  intl,
  invoice,
  invoiceLine,
  invoiceLines,
  poLineMap,
  userMap,
  vendorMap,
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
    vouchers,
  });

  const invoiceLineExportData = invoiceLine
    ? getInvoiceLineExportData({
      expenseClassMap,
      fundsMap,
      intl,
      invalidReferenceLabel,
      invoice,
      invoiceLine,
      poLineMap,
      userMap,
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
  fundsMap,
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
    fundsMap,
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
