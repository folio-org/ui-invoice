import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  NavList,
  NavListItem,
  Pane,
} from '@folio/stripes/components';

class SettingsAdjustmentsList extends Component {
  static propTypes = {
    label: PropTypes.object.isRequired,
    adjustments: PropTypes.arrayOf(PropTypes.object),
    rootPath: PropTypes.string.isRequired,
  };

  static defaultProps = {
    adjustments: [],
  };

  render() {
    const { label, rootPath, adjustments } = this.props;

    const lastMenu = (
      <Button
        data-test-new-adjustment-button
        to={`${rootPath}/create`}
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
      >
        <FormattedMessage id="ui-invoice.button.new" />
      </Button>
    );

    return (
      <Pane
        id="setting-adjustments-pane"
        lastMenu={lastMenu}
        paneTitle={label}
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
    );
  }
}

export default SettingsAdjustmentsList;
