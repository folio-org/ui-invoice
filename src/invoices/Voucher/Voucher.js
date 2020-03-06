import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import VoucherViewLayer from './VoucherViewLayer';
import { VoucherEditContainer } from './VoucherEditForm';

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
          <VoucherEditContainer
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

export default withRouter(Voucher);
