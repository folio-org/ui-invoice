// eslint-disable-next-line filenames/match-exported
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { stripesShape } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import {
  ToastContext,
} from '@folio/stripes-acq-components';

import { Invoices } from './invoices';
import Settings from './settings';

class Invoice extends React.Component {
  static propTypes = {
    showSettings: PropTypes.bool,
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.callout = React.createRef();
  }

  render() {
    const {
      showSettings,
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Fragment>
        <ToastContext.Provider value={this.callout}>
          <Invoices />
        </ToastContext.Provider>
        <Callout ref={this.callout} />
      </Fragment>
    );
  }
}

export default Invoice;
