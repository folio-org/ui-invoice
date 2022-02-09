import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import {
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  NavList,
  NavListItem,
  Pane,
  HasCommand,
  checkScope,
} from '@folio/stripes/components';
import { handleKeyCommand, usePaneFocus } from '@folio/stripes-acq-components';

const SettingsAdjustmentsList = ({ label, rootPath, adjustments = [] }) => {
  const { paneTitleRef } = usePaneFocus();
  const history = useHistory();
  const stripes = useStripes();
  const lastMenu = useMemo(() => (
    <IfPermission perm="ui-invoice.settings.all">
      <Button
        data-test-new-adjustment-button
        to={`${rootPath}/create`}
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
      >
        <FormattedMessage id="ui-invoice.button.new" />
      </Button>
    </IfPermission>
  ), [rootPath]);

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-invoice.settings.all')) {
          history.push(`${rootPath}/create`);
        }
      }),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        id="setting-adjustments-pane"
        lastMenu={lastMenu}
        paneTitle={label}
        paneTitleRef={paneTitleRef}
        defaultWidth="fill"
        fluidContentWidth
      >
        <NavList>
          {adjustments.map(d => (
            <NavListItem
              key={d.id}
              to={`${rootPath}/${d.id}/view`}
            >
              {d.title}
            </NavListItem>
          ))}
        </NavList>
      </Pane>
    </HasCommand>
  );
};

SettingsAdjustmentsList.propTypes = {
  label: PropTypes.object.isRequired,
  adjustments: PropTypes.arrayOf(PropTypes.object),
  rootPath: PropTypes.string.isRequired,
};

export default SettingsAdjustmentsList;
