// eslint-disable-next-line filenames/match-exported
import React from 'react';
import PropTypes from 'prop-types';

import { stripesShape } from '@folio/stripes/core';

import { Invoices } from './invoices';
import Settings from './settings';

class Invoice extends React.Component {
  static propTypes = {
    showSettings: PropTypes.bool,
    stripes: stripesShape.isRequired,
  };

  render() {
    const {
      showSettings,
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Invoices />
    );
  }
}

export default Invoice;
