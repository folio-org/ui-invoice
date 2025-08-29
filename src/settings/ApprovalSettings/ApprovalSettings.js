import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { CONFIG_NAME_APPROVALS } from '../../common/constants';
import { InvoiceStorageSettingsManager } from '../components';
import ApprovalSettingsForm from './ApprovalSettingsForm';

import css from '../components/InvoiceStorageSettingsManager/InvoiceStorageSettingsManager.css';

const onBeforeSave = (data) => JSON.stringify(data);

const ApprovalSettings = ({ label }) => {
  const intl = useIntl();

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-invoice.settings.approvals.label' })}>
      <div
        data-test-invoice-settings-approvals
        className={css.formWrapper}
      >
        <InvoiceStorageSettingsManager
          configName={CONFIG_NAME_APPROVALS}
          getInitialValues={getConfigSetting}
          label={label}
          onBeforeSave={onBeforeSave}
        >
          <ApprovalSettingsForm />
        </InvoiceStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

ApprovalSettings.propTypes = {
  label: PropTypes.node.isRequired,
};

export default ApprovalSettings;
