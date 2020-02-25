import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Pane,
} from '@folio/stripes/components';

import BatchGroupConfigurationFormFooter from './BatchGroupConfigurationFormFooter';
import BatchGroupsField from './BatchGroupsField';

const BatchGroupConfigurationForm = ({
  batchGroups,
  handleSubmit,
  pristine,
  setSelectedBatchGroupId,
  submitting,
}) => {
  const paneFooter = (
    <BatchGroupConfigurationFormFooter
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
    />
  );

  return (
    <Pane
      data-test-batch-group-configuration-settings
      defaultWidth="fill"
      footer={paneFooter}
      id="pane-batch-group-configuration"
      paneTitle={<FormattedMessage id="ui-invoice.settings.batchGroupConfiguration.label" />}
    >
      <BatchGroupsField
        batchGroups={batchGroups}
        setSelectedBatchGroupId={setSelectedBatchGroupId}
      />
    </Pane>
  );
};

BatchGroupConfigurationForm.propTypes = {
  batchGroups: PropTypes.arrayOf(PropTypes.object),
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  setSelectedBatchGroupId: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(BatchGroupConfigurationForm);
