import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Button,
  Col,
  Icon,
  Paneset,
  MenuSection,
  Pane,
  Row,
} from '@folio/stripes/components';
import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';

import { LoadingPane } from '../../common/components';
import {
  invoiceResource,
  VOUCHER_BY_ID,
  VOUCHER_LINES,
} from '../../common/resources';
import VoucherView from './VoucherView';

const VoucherViewLayer = ({ match: { params }, history, location, resources }) => {
  const voucher = get(resources, ['voucher', 'records', 0]);
  const voucherLines = get(resources, ['voucherLines', 'records'], []);
  const vendorInvoiceNo = get(resources, ['invoice', 'records', 0, 'vendorInvoiceNo']);
  const isLoading = !get(resources, ['voucher', 'hasLoaded']);

  const closeVoucher = useCallback(
    () => {
      const _path = `/invoice/view/${params.id}`;

      history.push({
        pathname: _path,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id, location.search],
  );

  const renderActionMenu = useCallback(() => {
    const path = {
      pathname: `/invoice/view/${params.id}/voucher/${params.voucherId}/edit`,
      search: location.search,
    };

    return (
      <MenuSection id="voucher-actions">
        <Button
          buttonStyle="dropdownItem"
          data-test-edit-voucher-button
          to={path}
        >
          <Icon size="small" icon="edit">
            <FormattedMessage id="ui-invoice.button.edit" />
          </Icon>
        </Button>
      </MenuSection>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={closeVoucher} />
      </Paneset>
    );
  }

  return (
    <Paneset>
      <Pane
        actionMenu={renderActionMenu}
        appIcon={<AppIcon app="invoice" size="small" />}
        defaultWidth="fill"
        dismissible
        id="pane-voucher"
        onClose={closeVoucher}
        paneSub={
          <FormattedMessage
            id="ui-invoice.voucher.paneSubTitle"
            values={{ voucherNumber: voucher.voucherNumber }}
          />
        }
        paneTitle={
          <FormattedMessage
            id="ui-invoice.voucher.paneTitle"
            values={{ vendorInvoiceNo }}
          />
        }
      >
        <Row>
          <Col
            xs={12}
            md={8}
            mdOffset={2}
          >
            <VoucherView
              voucher={voucher}
              voucherLines={voucherLines}
            />
          </Col>
        </Row>
      </Pane>
    </Paneset>
  );
};

VoucherViewLayer.manifest = Object.freeze({
  voucher: VOUCHER_BY_ID,
  voucherLines: {
    ...VOUCHER_LINES,
    params: {
      query: 'voucherId==:{voucherId}',
    },
  },
  invoice: invoiceResource,
});

VoucherViewLayer.propTypes = {
  match: ReactRouterPropTypes.match,
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(VoucherViewLayer);
