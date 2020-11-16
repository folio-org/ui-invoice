import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { PermissionedRoute } from '@folio/stripes-acq-components';

import {
  RETURN_LINK,
  RETURN_LINK_LABEL_ID,
} from '../../common/constants';
import VoucherViewLayer from './VoucherViewLayer';
import { VoucherEditContainer } from './VoucherEditForm';

const Voucher = ({ match: { path } }) => (
  <Switch>
    <Route
      exact
      path={`${path}:voucherId/view`}
      component={VoucherViewLayer}
    />
    <PermissionedRoute
      exact
      path={`${path}:voucherId/edit`}
      perm="ui-invoice.invoice.edit"
      returnLink={RETURN_LINK}
      returnLinkLabelId={RETURN_LINK_LABEL_ID}
    >
      <VoucherEditContainer />
    </PermissionedRoute>
  </Switch>
);

Voucher.propTypes = {
  match: ReactRouterPropTypes.match,
};

export default withRouter(Voucher);
