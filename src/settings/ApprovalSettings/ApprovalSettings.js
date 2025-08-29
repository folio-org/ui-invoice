import PropTypes from 'prop-types';

import { getConfigSetting } from '@folio/stripes-acq-components';

import { CONFIG_NAME_APPROVALS } from '../../common/constants';
import { InvoiceStorageSettingsManager } from '../components';
import ApprovalSettingsForm from './ApprovalSettingsForm';

const onBeforeSave = (data) => JSON.stringify(data);

const ApprovalSettings = ({ label }) => {
  return (
    <InvoiceStorageSettingsManager
      configName={CONFIG_NAME_APPROVALS}
      getInitialValues={getConfigSetting}
      label={label}
      onBeforeSave={onBeforeSave}
    >
      <div data-test-invoice-settings-approvals>
        <ApprovalSettingsForm />
      </div>
    </InvoiceStorageSettingsManager>
  );
};

ApprovalSettings.propTypes = {
  label: PropTypes.node.isRequired,
};

export default ApprovalSettings;
