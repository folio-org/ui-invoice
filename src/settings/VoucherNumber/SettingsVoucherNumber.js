import PropTypes from 'prop-types';

import { getConfigSetting } from '@folio/stripes-acq-components';

import { InvoiceStorageSettingsManager } from '../../common/components';
import { CONFIG_NAME_VOUCHER_NUMBER } from '../../common/constants';
import SettingsVoucherNumberForm from './SettingsVoucherNumberForm';

const onBeforeSave = (data) => JSON.stringify(data);

const SettingsVoucherNumber = ({ label }) => {
  return (
    <InvoiceStorageSettingsManager
      configName={CONFIG_NAME_VOUCHER_NUMBER}
      getInitialValues={getConfigSetting}
      label={label}
      onBeforeSave={onBeforeSave}
    >
      <div data-test-invoice-settings-voucher-number>
        <SettingsVoucherNumberForm />
      </div>
    </InvoiceStorageSettingsManager>
  );
};

SettingsVoucherNumber.propTypes = {
  label: PropTypes.node.isRequired,
};

export default SettingsVoucherNumber;
