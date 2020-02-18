import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

const columnMapping = {
  name: <FormattedMessage id="ui-invoice.settings.batchGroups.column.name" />,
  description: <FormattedMessage id="ui-invoice.settings.batchGroups.column.description" />,
};
const SYSTEM_GROUP_ID = '2a2cb998-1437-41d1-88ad-01930aaeadd5';
const suppressDelete = group => group.id === SYSTEM_GROUP_ID;

class BatchGroupsSettings extends React.Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <this.connectedControlledVocab
        actionSuppressor={{ delete: suppressDelete }}
        baseUrl="batch-groups"
        columnMapping={columnMapping}
        data-test-batch-groups-settings
        editable
        hiddenFields={['numberOfObjects']}
        id="batch-groups"
        label={intl.formatMessage({ id: 'ui-invoice.settings.batchGroups.label' })}
        labelSingular={intl.formatMessage({ id: 'ui-invoice.settings.batchGroups.labelSingular' })}
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
  intl: intlShape.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(BatchGroupsSettings);
