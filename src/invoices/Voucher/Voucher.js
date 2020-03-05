import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import VoucherViewLayer from './VoucherViewLayer';
import { VoucherEditLayer } from './VoucherEditForm';

const Voucher = ({ match: { path } }) => (
  <Switch>
    <Route
      exact
      path={`${path}:voucherId/view`}
      render={
        props => (
          <VoucherViewLayer
            {...props}
          />
        )
      }
    />
    <Route
      exact
      path={`${path}:voucherId/edit`}
      render={
        props => (
          <VoucherEditLayer
            {...props}
          />
        )
    }
    />
  </Switch>
);

Voucher.propTypes = {
  match: ReactRouterPropTypes.match,
};

export default Voucher;
