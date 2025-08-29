import {
  FormattedMessage,
  injectIntl,
  useIntl,
} from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';

import SettingsApprovals from './ApprovalSettings';
import SettingsAdjustments from './adjustments';
import { BatchGroupsSettings } from './BatchGroupsSettings';
import { BatchGroupConfigurationSettings } from './BatchGroupConfigurationSettings';
import SettingsVoucherNumber from './VoucherNumber';

const sections = [
  {
    label: <FormattedMessage id="ui-invoice.settings.general.label" />,
    pages: [
      {
        route: 'approvals',
        label: <FormattedMessage id="ui-invoice.settings.approvals.label" />,
        component: SettingsApprovals,
      },
      {
        route: 'adjustments',
        label: <FormattedMessage id="ui-invoice.settings.adjustments.label" />,
        component: SettingsAdjustments,
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-invoice.settings.vouchers.label" />,
    pages: [
      {
        route: 'batch-groups',
        label: <FormattedMessage id="ui-invoice.settings.batchGroups.label" />,
        component: BatchGroupsSettings,
      },
      {
        route: 'batch-group-configuration',
        label: <FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.label" />,
        component: BatchGroupConfigurationSettings,
      },
      {
        route: 'voucher-number',
        label: <FormattedMessage id="ui-invoice.settings.voucherNumber.label" />,
        component: SettingsVoucherNumber,
      },
    ],
  },
];

const InvoiceSettings = (props) => {
  const intl = useIntl();

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <TitleManager page={intl.formatMessage({ id: 'ui-invoice.document.settings.title' })}>
        <Settings
          {...props}
          sections={sections}
          paneTitle={<FormattedMessage id="ui-invoice.settings.paneTitle" />}
        />
      </TitleManager>
    </CommandList>
  );
};

export default injectIntl(InvoiceSettings);
