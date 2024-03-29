import React, { useCallback, useRef, useMemo } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  checkScope,
  Col,
  collapseAllSections,
  expandAllSections,
  HasCommand,
  Icon,
  LoadingPane,
  MenuSection,
  Pane,
  Paneset,
  Row,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import {
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { PrintVoucherContainer } from '../PrintVoucher';
import VoucherView from './VoucherView';
import { useVoucher } from './useVoucher';

const VoucherViewLayer = ({ match: { params }, history, location }) => {
  const { isLoading, voucher, voucherLines, invoice } = useVoucher(params.id, params.voucherId);
  const [isPrintModalOpened, togglePrintModal] = useModalToggle();
  const accordionStatusRef = useRef();
  const stripes = useStripes();

  const closeVoucher = useCallback(
    () => {
      const _path = `/invoice/view/${params.id}`;

      history.push({
        pathname: _path,
        search: location.search,
      });
    },
    [params.id, history, location.search],
  );

  const voucherEditPath = useMemo(() => ({
    pathname: `/invoice/view/${params.id}/voucher/${params.voucherId}/edit`,
    search: location.search,
  }), [location.search, params.id, params.voucherId]);

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <MenuSection id="voucher-actions">
        <IfPermission perm="voucher.vouchers.item.put">
          <Button
            buttonStyle="dropdownItem"
            data-test-edit-voucher-button
            to={voucherEditPath}
          >
            <Icon size="small" icon="edit">
              <FormattedMessage id="ui-invoice.button.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <Button
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            togglePrintModal();
          }}
        >
          <Icon size="small" icon="print">
            <FormattedMessage id="ui-invoice.voucher.print" />
          </Icon>
        </Button>
      </MenuSection>
    );
  }, [togglePrintModal, voucherEditPath]);

  const shortcuts = [
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-invoice.invoice.edit')) {
          history.push(voucherEditPath);
        }
      }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/invoice')),
    },
  ];

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={closeVoucher} />
      </Paneset>
    );
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
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
                ref={accordionStatusRef}
                voucher={voucher}
                voucherLines={voucherLines}
              />
            </Col>
          </Row>
        </Pane>
        {isPrintModalOpened && (
          <PrintVoucherContainer
            closePrint={togglePrintModal}
            invoice={invoice}
          />
        )}
      </Paneset>
    </HasCommand>
  );
};

VoucherViewLayer.propTypes = {
  match: ReactRouterPropTypes.match,
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
};

export default VoucherViewLayer;
