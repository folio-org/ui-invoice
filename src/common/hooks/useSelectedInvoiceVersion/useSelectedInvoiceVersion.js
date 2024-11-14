import {
  filter,
  flow,
  get,
  keyBy,
  uniq,
} from 'lodash/fp';
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
  CONFIG_ADDRESSES,
  CONFIG_API,
  LIMIT_MAX,
  MODULE_TENANT,
  fetchExportDataByIds,
  fetchOrganizationsByIds,
  getAddresses,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { useInvoice } from '../useInvoice';

const getUniqItems = (arr) => (
  flow(
    uniq,
    filter(Boolean),
  )(arr)
);

export const getTenantAddresses = (ky) => async () => {
  const searchParams = {
    limit: LIMIT_MAX,
    query: `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES})`,
  };

  return ky.get(CONFIG_API, { searchParams }).json();
};

export const getVersionMetadata = (version, entity) => ({
  ...get(entity, 'metadata', {}),
  updatedByUserId: version?.userId,
  updatedDate: version?.actionDate,
});

export const useSelectedInvoiceVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'selected-invoice-version' });

  const deletedRecordLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });
  const currentVersion = useMemo(() => (
    versions?.find(({ id }) => id === versionId)
  ), [versionId, versions]);
  const versionSnapshot = useMemo(() => (
    get(snapshotPath, currentVersion)
  ), [snapshotPath, currentVersion]);

  const {
    invoice,
    isLoading: isInvoiceLoading,
  } = useInvoice(currentVersion?.id);

  const metadata = useMemo(() => getVersionMetadata(currentVersion, invoice), [currentVersion, invoice]);
  const assignedToId = versionSnapshot?.assignedTo;
  const createdByUserId = metadata?.createdByUserId;
  const vendorId = versionSnapshot?.vendor;
  const billToId = versionSnapshot?.billTo;

  const versionUserIds = useMemo(() => getUniqItems([assignedToId, createdByUserId]), [assignedToId, createdByUserId]);
  const {
    users,
    isLoading: isUsersLoading,
  } = useUsersBatch(versionUserIds);
  const versionUsersMap = keyBy('id', users);

  const {
    isLoading: isVersionDataLoading,
    data: selectedVersion = {},
  } = useQuery(
    [namespace, versionId, versionSnapshot?.id],
    async () => {
      const organizationIds = [vendorId];
      const acqUnitsIds = versionSnapshot?.acqUnitIds || [];

      const [
        organizationsMap,
        acqUnitsMap,
        addressesMap,
      ] = await Promise.all([
        fetchOrganizationsByIds(ky)(organizationIds).then(keyBy('id')),
        fetchExportDataByIds({ ky, ids: acqUnitsIds, api: ACQUISITIONS_UNITS_API, records: 'acquisitionsUnits' })(acqUnitsIds).then(keyBy('id')),
        getTenantAddresses(ky)()
          .then(({ configs }) => getAddresses(configs))
          .then(keyBy('id')),
      ]);

      const assignedTo = versionUsersMap[assignedToId]
        ? getFullName(versionUsersMap[assignedToId])
        : deletedRecordLabel;

      const createdByUser = versionUsersMap[createdByUserId]
        ? getFullName(versionUsersMap[createdByUserId])
        : deletedRecordLabel;

      return {
        ...versionSnapshot,
        acqUnits: acqUnitsIds.map(acqUnitsId => acqUnitsMap[acqUnitsId]?.name || deletedRecordLabel).join(', '),
        assignedTo: assignedToId && assignedTo,
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
    || isUsersLoading
    || isVersionDataLoading
  );

  return {
    selectedVersion,
    isLoading,
  };
};
