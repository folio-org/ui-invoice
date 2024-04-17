import {
  compact,
  flatten,
  uniq,
  keyBy,
} from 'lodash';

import {
  ACQUISITIONS_UNITS_API,
  CONFIG_ADDRESSES,
  CONFIG_API,
  EXPENSE_CLASSES_API,
  fetchAllRecords,
  fetchExportDataByIds,
  FUNDS_API,
  getAddresses,
  INVOICES_API,
  LINES_API,
  MODULE_TENANT,
  USERS_API,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  BATCH_GROUPS_API,
  FISCAL_YEARS_API,
  INVOICE_LINE_API,
  VOUCHER_LINES_API,
  VOUCHERS_API,
} from '../../../../common/constants';
import { createExportReport } from './createExportReport';

const getExportUserIds = (invoices = [], invoiceLines = []) => {
  const invoiceUserIds = invoices.map(
    ({ approvedBy, metadata }) => [approvedBy, metadata?.createdByUserId, metadata?.updatedByUserId],
  );
  const invoiceLineUserIds = invoiceLines.map(
    ({ metadata }) => [metadata?.createdByUserId, metadata?.updatedByUserId],
  );

  return uniq(compact(flatten([...invoiceUserIds, ...invoiceLineUserIds])));
};

export const getExportData = async ({ ky, intl, query }) => {
  const exportInvoices = await fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { invoices } = await ky.get(INVOICES_API, { searchParams }).json();

        return invoices;
      },
    },
    query,
  );
  const exportInvoiceIds = exportInvoices.map(({ id }) => id);
  const buildInvoiceLinesQuery = (itemsChunk) => itemsChunk.map(id => `invoiceId==${id}`).join(' or ');
  const invoiceLines = await fetchExportDataByIds({
    ky, ids: exportInvoiceIds, buildQuery: buildInvoiceLinesQuery, api: INVOICE_LINE_API, records: 'invoiceLines',
  });
  const vendorIds = uniq(exportInvoices.map(({ vendorId }) => vendorId));
  const vendors = await fetchExportDataByIds({ ky, ids: vendorIds, api: VENDORS_API, records: 'organizations' });
  const acqUnitsIds = uniq(flatten((exportInvoices.map(({ acqUnitIds }) => acqUnitIds))));
  const acqUnits = await fetchExportDataByIds({ ky, ids: acqUnitsIds, api: ACQUISITIONS_UNITS_API, records: 'acquisitionsUnits' });

  const userIds = getExportUserIds(exportInvoices, invoiceLines);
  const users = await fetchExportDataByIds({ ky, ids: userIds, api: USERS_API, records: 'users' });

  const batchGroupIds = uniq(exportInvoices.map(({ batchGroupId }) => batchGroupId));
  const batchGroups = await fetchExportDataByIds({ ky, ids: batchGroupIds, api: BATCH_GROUPS_API, records: 'batchGroups' });
  const poLineIds = uniq(invoiceLines.map(({ poLineId }) => poLineId).filter(Boolean));
  const poLines = await fetchExportDataByIds({ ky, ids: poLineIds, api: LINES_API, records: 'poLines' });
  const buildVouchersQuery = (itemsChunk) => itemsChunk.map(id => `invoiceId==${id}`).join(' or ');
  const vouchers = await fetchExportDataByIds({
    ky, ids: exportInvoiceIds, buildQuery: buildVouchersQuery, api: VOUCHERS_API, records: 'vouchers',
  });
  const voucherIds = vouchers.map(({ id }) => id);
  const buildVoucherLinesQuery = (itemsChunk) => itemsChunk.map(id => `voucherId==${id}`).join(' or ');
  const voucherLines = await fetchExportDataByIds({
    ky, ids: voucherIds, buildQuery: buildVoucherLinesQuery, api: VOUCHER_LINES_API, records: 'voucherLines',
  });
  const invoiceExpenseClassIds = flatten(exportInvoices.adjustments?.map(
    ({ fundDistributions }) => (fundDistributions?.map(({ expenseClassId }) => expenseClassId)),
  ));
  const invoiceLineExpenseClassIds = flatten(invoiceLines.map(
    ({ fundDistributions }) => (fundDistributions?.map(({ expenseClassId }) => expenseClassId)),
  ));
  const expenseClassIds = uniq([...invoiceExpenseClassIds, ...invoiceLineExpenseClassIds].filter(Boolean));
  const expenseClasses = await fetchExportDataByIds({ ky, ids: expenseClassIds, api: EXPENSE_CLASSES_API, records: 'expenseClasses' });
  const addressIds = uniq(flatten(exportInvoices.map(({ billTo }) => billTo))).filter(Boolean);
  const buildAddressQuery = (itemsChunk) => {
    const subQuery = itemsChunk
      .map(id => `id==${id}`)
      .join(' or ');

    return subQuery ? `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES} and (${subQuery}))` : '';
  };
  const addressRecords = await fetchExportDataByIds({
    ky, ids: addressIds, buildQuery: buildAddressQuery, api: CONFIG_API, records: 'configs',
  });
  const addresses = getAddresses(addressRecords);
  const fiscalYearIds = uniq(exportInvoices.map(({ fiscalYearId }) => fiscalYearId));
  const fiscalYears = await fetchExportDataByIds({ ky, ids: fiscalYearIds, api: FISCAL_YEARS_API, records: 'fiscalYears' });
  const fundIds = uniq(invoiceLines.flatMap(({ fundDistributions }) => fundDistributions?.map(({ fundId }) => fundId)));
  const funds = await fetchExportDataByIds({ ky, ids: fundIds, api: FUNDS_API, records: 'funds' });

  return (createExportReport({
    acqUnitMap: keyBy(acqUnits, 'id'),
    addressMap: keyBy(addresses, 'id'),
    batchGroupMap: keyBy(batchGroups, 'id'),
    expenseClassMap: keyBy(expenseClasses, 'id'),
    fiscalYearMap: keyBy(fiscalYears, 'id'),
    fundsMap: keyBy(funds, 'id'),
    intl,
    invoiceLines,
    invoices: exportInvoices,
    poLineMap: keyBy(poLines, 'id'),
    userMap: keyBy(users, 'id'),
    vendorMap: keyBy(vendors, 'id'),
    voucherLines,
    vouchers,
  }));
};
