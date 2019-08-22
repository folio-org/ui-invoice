import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import ReactRouterPropTypes from 'react-router-prop-types';

import VoucherViewLayer from './VoucherViewLayer';

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
  </Switch>
);

Voucher.propTypes = {
  match: ReactRouterPropTypes.match,
};

export default Voucher;
