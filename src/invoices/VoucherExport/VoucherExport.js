import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useHistory } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import { noop } from 'lodash';

import {
  checkScope,
  Col,
  HasCommand,
  Loading,
  Pane,
  Paneset,
  Row,
  Select,
} from '@folio/stripes/components';
import {
  handleKeyCommand,
  RESULT_COUNT_INCREMENT,
  useSorting,
} from '@folio/stripes-acq-components';

import { getBatchGroupsOptions } from '../../common/utils';
import { BatchVoucherExportsList } from './BatchVoucherExportsList';
import { BV_EXPORT_SORTABLE_COLUMNS } from './BatchVoucherExportsList/constants';
import { ConfirmManualExportModal } from './ConfirmManualExportModal';
import { VoucherExportFooter } from './VoucherExportFooter';
import {
  useBatchGroupExportConfigs,
  useBatchGroups,
  useBatchVoucherExports,
  useManualExportRun,
} from './hooks';

const VoucherExport = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();

  const [selectedBatchGroupId, setSelectedBatchGroupId] = useState();
  const [confirmManualExportModalOpen, setConfirmManualExportModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, BV_EXPORT_SORTABLE_COLUMNS);

  const {
    batchGroups,
    isLoading: isBatchGroupsLoading,
  } = useBatchGroups();
  const {
    batchVoucherExports,
    totalRecords,
    isFetching,
    isLoading: isBatchVoucherExportsLoading,
    refetch,
  } = useBatchVoucherExports(
    selectedBatchGroupId,
    pagination,
    { sortingField, sortingDirection },
  );
  const {
    exportConfigs,
    isLoading: isExportConfigsLoading,
  } = useBatchGroupExportConfigs(selectedBatchGroupId);

  const [runManualExport, clearManualExportRun] = useManualExportRun({
    batchGroupId: selectedBatchGroupId,
    batchGroups,
    batchVoucherExports,
    refetch,
  });

  useEffect(() => {
    return () => {
      clearManualExportRun();
    };
  }, []);

  useEffect(() => {
    if (batchGroups.length === 1) setSelectedBatchGroupId(batchGroups[0].id);
  }, [batchGroups]);

  const isLoading = (
    isBatchGroupsLoading
    || isBatchVoucherExportsLoading
    || isExportConfigsLoading
  );

  const batchGroupsOptions = useMemo(() => (
    batchGroups.length > 1
      ? [
        {
          label: intl.formatMessage({ id: 'ui-invoice.voucherExport.batchGroup.select' }),
          value: '',
        },
        ...getBatchGroupsOptions(batchGroups),
      ]
      : getBatchGroupsOptions(batchGroups)
  ), [batchGroups, intl]);

  const selectedBatchGroupName = useMemo(() => (
    batchGroups.find(({ id }) => id === selectedBatchGroupId)?.name
  ), [batchGroups, selectedBatchGroupId]);

  const onCancel = useCallback(() => (
    history.push({
      pathname: '/invoice',
      search: location.search,
    })
  ), [history, location.search]);

  const applySorting = (e, meta) => {
    changeSorting(e, meta);
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/invoice')),
    },
  ];

  const isManualExportDisabled = isLoading || !selectedBatchGroupId || !exportConfigs?.format;

  const paneFooter = (
    <VoucherExportFooter
      disabled={isManualExportDisabled}
      onCancel={onCancel}
      runManualExport={() => setConfirmManualExportModalOpen(true)}
    />
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <Pane
          defaultWidth="100%"
          dismissible
          id="pane-voucher-export"
          onClose={onCancel}
          paneTitle={<FormattedMessage id="ui-invoice.voucherExport.paneTitle" />}
          footer={paneFooter}
        >
          <Row>
            <Col xs={4}>
              <Select
                disabled={isLoading}
                dataOptions={batchGroupsOptions}
                label={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.batchGroup" />}
                onChange={({ target }) => setSelectedBatchGroupId(target.value)}
                fullWidth
                required
              />
            </Col>
          </Row>
          {
            selectedBatchGroupId && (
              isLoading
                ? <Loading />
                : (
                  <BatchVoucherExportsList
                    columnIdPrefix="voucher-export"
                    batchVoucherExports={batchVoucherExports}
                    format={exportConfigs?.format}
                    isLoading={isFetching}
                    onNeedMoreData={setPagination}
                    pagination={pagination}
                    sortDirection={sortingDirection}
                    onHeaderClick={applySorting}
                    totalCount={totalRecords}
                  />
                )
            )
          }

          <ConfirmManualExportModal
            open={confirmManualExportModalOpen}
            onConfirm={() => {
              runManualExport();
              setConfirmManualExportModalOpen(false);
            }}
            onCancel={() => setConfirmManualExportModalOpen(false)}
            selectedBatchGroupName={selectedBatchGroupName}
          />

        </Pane>
      </Paneset>
    </HasCommand>
  );
};

export default VoucherExport;
