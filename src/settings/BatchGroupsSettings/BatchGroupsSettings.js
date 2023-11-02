import React from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { stripesShape } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { hasEditSettingsPerm } from '../utils';

const columnMapping = {
  name: <FormattedMessage id="ui-invoice.settings.batchGroups.column.name" />,
  description: <FormattedMessage id="ui-invoice.settings.batchGroups.column.description" />,
};
const SYSTEM_GROUP_ID = '2a2cb998-1437-41d1-88ad-01930aaeadd5';
const suppressDelete = group => group.id === SYSTEM_GROUP_ID;

// eslint-disable-next-line no-unused-vars
const preUpdateHook = ({ metadata, ...rest }) => rest;

class BatchGroupsSettings extends React.Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <this.connectedControlledVocab
        actionSuppressor={{ delete: suppressDelete, edit: () => false }}
        baseUrl="batch-groups"
        columnMapping={columnMapping}
        data-test-batch-groups-settings
        editable={hasEditSettingsPerm(stripes)}
        hiddenFields={['numberOfObjects']}
        id="batch-groups"
        preUpdateHook={preUpdateHook}
        label={intl.formatMessage({ id: 'ui-invoice.settings.batchGroups.label' })}
        translations={getControlledVocabTranslations('ui-invoice.settings.batchGroups')}
        nameKey="name"
        objectLabel={<FormattedMessage id="ui-invoice.settings.batchGroups.label" />}
        records="batchGroups"
        sortby="name"
        stripes={stripes}
        visibleFields={['name', 'description']}
      />
    );
  }
}

BatchGroupsSettings.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(BatchGroupsSettings);
