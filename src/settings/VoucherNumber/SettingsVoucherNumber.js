import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { CONFIG_NAME_VOUCHER_NUMBER } from '../../common/constants';
import { InvoiceStorageSettingsManager } from '../components';
import SettingsVoucherNumberForm from './SettingsVoucherNumberForm';

import css from '../components/InvoiceStorageSettingsManager/InvoiceStorageSettingsManager.css';

const onBeforeSave = (data) => JSON.stringify(data);

const SettingsVoucherNumber = ({ label }) => {
  const intl = useIntl();

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-invoice.settings.voucherNumber.label' })}>
      <div
        data-test-invoice-settings-voucher-number
        className={css.formWrapper}
      >
        <InvoiceStorageSettingsManager
          configName={CONFIG_NAME_VOUCHER_NUMBER}
          getInitialValues={getConfigSetting}
          label={label}
          onBeforeSave={onBeforeSave}
        >
          <SettingsVoucherNumberForm />
        </InvoiceStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

SettingsVoucherNumber.propTypes = {
  label: PropTypes.node.isRequired,
};

export default SettingsVoucherNumber;
