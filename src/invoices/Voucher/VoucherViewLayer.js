import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Icon,
  Paneset,
  MenuSection,
  Pane,
  Row,
  LoadingPane,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission,
} from '@folio/stripes/core';

import VoucherView from './VoucherView';
import { useVoucher } from './useVoucher';

const VoucherViewLayer = ({ match: { params }, history, location }) => {
  const { isLoading, voucher, voucherLines, invoice } = useVoucher(params.id, params.voucherId);

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
        <IfPermission perm="voucher.vouchers.item.put">
          <Button
            buttonStyle="dropdownItem"
            data-test-edit-voucher-button
            to={path}
          >
            <Icon size="small" icon="edit">
              <FormattedMessage id="ui-invoice.button.edit" />
            </Icon>
          </Button>
        </IfPermission>
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
            values={{ vendorInvoiceNo: invoice.vendorInvoiceNo }}
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

VoucherViewLayer.propTypes = {
  match: ReactRouterPropTypes.match,
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
};

export default VoucherViewLayer;
