import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import uniq from 'lodash/uniq';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
import {
  getVersionMetadata,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { useInvoice } from '../useInvoice';
import { useInvoiceLine } from '../useInvoiceLine';

const DEFAULT_VALUE = [];

export const useSelectedInvoiceLineVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const intl = useIntl();
  const [namespace] = useNamespace({ key: 'selected-invoice-line-version' });

  const deletedRecordLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });
  const currentVersion = useMemo(() => versions?.find(({ id }) => id === versionId), [versionId, versions]);
  const versionSnapshot = useMemo(() => get(currentVersion, snapshotPath), [snapshotPath, currentVersion]);

  const {
    invoiceLine,
    isLoading: isInvoiceLineLoading,
  } = useInvoiceLine(currentVersion?.invoiceLineId);
  const {
    invoice,
    isLoading: isInvoiceLoading,
  } = useInvoice(currentVersion?.invoiceId);

  const metadata = useMemo(() => getVersionMetadata(currentVersion, invoiceLine), [currentVersion, invoiceLine]);
  const createdByUserId = metadata?.createdByUserId;
  const updatedByUserId = metadata?.updatedByUserId;

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
      const createdByUser = versionUsersMap[createdByUserId]
        ? getFullName(versionUsersMap[createdByUserId])
        : deletedRecordLabel;

      return {
        ...versionSnapshot,
        createdByUser: createdByUserId && createdByUser,
        currency: invoice?.currency,
        metadata,
      };
    },
    {
      enabled: Boolean(
        versionId
        && invoiceLine?.id
        && !isInvoiceLoading
        && !isInvoiceLineLoading
        && !isUsersLoading,
      ),
      ...options,
    },
  );

  const isLoading = (
    isInvoiceLineLoading
    || isVersionDataLoading
    || isUsersLoading
    || isInvoiceLoading
  );

  return {
    selectedVersion,
    isLoading,
  };
};
