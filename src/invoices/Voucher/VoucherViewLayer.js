import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Button,
  Col,
  Icon,
  Layer,
  MenuSection,
  Pane,
  PaneMenu,
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

const VoucherViewLayer = ({ match: { params }, mutator, resources }) => {
  const voucher = get(resources, ['voucher', 'records', 0]);
  const voucherLines = get(resources, ['voucherLines', 'records'], []);
  const vendorInvoiceNo = get(resources, ['invoice', 'records', 0, 'vendorInvoiceNo']);
  const isLoading = !get(resources, ['voucher', 'hasLoaded']);

  const closeVoucher = useCallback(
    () => {
      const _path = `/invoice/view/${params.id}`;

      mutator.query.update({ _path });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id],
  );

  const renderActionMenu = () => (
    <MenuSection id="voucher-actions">
      <Button
        buttonStyle="dropdownItem"
        data-test-edit-voucher-button
      >
        <Icon size="small" icon="edit">
          <FormattedMessage id="ui-invoice.button.edit" />
        </Icon>
      </Button>
    </MenuSection>
  );

  const lastMenu = (
    <PaneMenu>
      <Button
        marginBottom0
        buttonStyle="primary"
      >
        <FormattedMessage id="ui-invoice.button.edit" />
      </Button>
    </PaneMenu>
  );

  if (isLoading) {
    return (
      <Layer isOpen>
        <LoadingPane onClose={closeVoucher} />
      </Layer>
    );
  }

  return (
    <Layer isOpen>
      <Pane
        actionMenu={renderActionMenu}
        appIcon={<AppIcon app="invoice" size="small" />}
        defaultWidth="fill"
        dismissible
        id="pane-voucher"
        lastMenu={lastMenu}
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
    </Layer>
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
  query: {},
});

VoucherViewLayer.propTypes = {
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(VoucherViewLayer);
