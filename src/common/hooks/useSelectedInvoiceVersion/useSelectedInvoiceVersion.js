import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import uniq from 'lodash/uniq';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
import {
  ACQUISITIONS_UNITS_API,
  fetchExportDataByIds,
  fetchOrganizationsByIds,
  getAddresses,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { useInvoice } from '../useInvoice';
import { getTenantAddresses, getVersionMetadata } from './utils';

const DEFAULT_VALUE = [];

export const useSelectedInvoiceVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'selected-invoice-version' });

  const deletedRecordLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });
  const currentVersion = useMemo(() => (
    versions?.find(({ id }) => id === versionId)
  ), [versionId, versions]);
  const versionSnapshot = useMemo(() => (
    get(currentVersion, snapshotPath)
  ), [snapshotPath, currentVersion]);

  const {
    invoice,
    isLoading: isInvoiceLoading,
  } = useInvoice(currentVersion?.invoiceId);

  const metadata = useMemo(() => getVersionMetadata(currentVersion, invoice), [currentVersion, invoice]);
  const createdByUserId = metadata?.createdByUserId;
  const updatedByUserId = metadata?.updatedByUserId;
  const vendorId = versionSnapshot?.vendorId;
  const billToId = versionSnapshot?.billTo;

  const versionUserIds = useMemo(() => uniq([updatedByUserId, createdByUserId]), [updatedByUserId, createdByUserId]);
  const {
    users = DEFAULT_VALUE,
    isLoading: isUsersLoading,
  } = useUsersBatch(versionUserIds);
  const versionUsersMap = keyBy(users, 'id');

  const {
    isLoading: isVersionDataLoading,
    data: selectedVersion = {},
  } = useQuery(
    [namespace, versionId, versionSnapshot?.id],
    async () => {
      const organizationIds = [vendorId];
      const acqUnitsIds = versionSnapshot?.acqUnitIds || DEFAULT_VALUE;

      const [
        organizationsMap,
        acqUnitsMap,
        addressesMap,
      ] = await Promise.all([
        fetchOrganizationsByIds(ky)(organizationIds).then(({ organizations }) => keyBy(organizations, 'id')),
        fetchExportDataByIds({
          ky,
          ids: acqUnitsIds,
          api: ACQUISITIONS_UNITS_API,
          records: 'acquisitionsUnits',
        }).then(data => keyBy(data, 'id')),
        getTenantAddresses(ky)()
          .then(({ configs }) => getAddresses(configs))
          .then(data => keyBy(data, 'id')),
      ]);

      const createdByUser = versionUsersMap[createdByUserId]
        ? getFullName(versionUsersMap[createdByUserId])
        : deletedRecordLabel;

      return {
        ...versionSnapshot,
        acqUnits: acqUnitsIds.map(acqUnitsId => acqUnitsMap[acqUnitsId]?.name || deletedRecordLabel).join(', '),
        vendor: organizationsMap[vendorId]?.name || deletedRecordLabel,
        createdByUser: createdByUserId && createdByUser,
        billTo: billToId && (addressesMap[billToId]?.address || deletedRecordLabel),
        metadata,
      };
    },
    {
      enabled: Boolean(
        versionId
        && invoice?.id
        && !isInvoiceLoading
        && !isUsersLoading,
      ),
      ...options,
    },
  );

  const isLoading = (
    isInvoiceLoading
    || isVersionDataLoading
    || isUsersLoading
  );

  return {
    selectedVersion,
    isLoading,
  };
};
