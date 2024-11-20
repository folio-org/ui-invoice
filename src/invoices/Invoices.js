import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { AppContextMenu } from '@folio/stripes/core';
import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';
import {
  AcqKeyboardShortcutsModal,
  handleKeyCommand,
  PermissionedRoute,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  INVOICE_CREATE_ROUTE,
  INVOICE_EDIT_ROUTE,
  INVOICE_LINE_CREATE_ROUTE,
  INVOICE_LINE_EDIT_ROUTE,
  INVOICE_LINE_SEQUENCE_ROUTE,
  INVOICE_ROUTE,
  INVOICE_VOUCHER_EXPORT_ROUTE,
  INVOICE_VOUCHER_ROUTE,
  RETURN_LINK,
  RETURN_LINK_LABEL_ID,
} from '../common/constants';
import { InvoiceLinesSequence } from './InvoiceLinesSequence';
import { InvoicesListContainer } from './InvoicesList';
import { CreateInvoice } from './CreateInvoice';
import { EditInvoice } from './EditInvoice';
import { CreateInvoiceLine } from './CreateInvoiceLine';
import { EditInvoiceLine } from './EditInvoiceLine';
import { Voucher } from './Voucher';
import { VoucherExport } from './VoucherExport';

const Invoices = () => {
  const [isOpen, toggleModal] = useModalToggle();
  const focusSearchField = () => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  };

  const shortcuts = [
    {
      name: 'search',
      handler: handleKeyCommand(focusSearchField),
    },
    {
      name: 'openShortcutModal',
      shortcut: 'mod+alt+k',
      handler: handleKeyCommand(toggleModal),
    },
  ];

  return (
    <>
      <CommandList commands={defaultKeyboardShortcuts}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {handleToggle => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="invoices-app-search-item"
                    to={{
                      pathname: RETURN_LINK,
                      state: { resetFilters: true },
                    }}
                    onClick={() => {
                      handleToggle();
                      focusSearchField();
                    }}
                  >
                    <FormattedMessage id="ui-invoice.appMenu.invoicesAppSearch" />
                  </NavListItem>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => {
                      handleToggle();
                      toggleModal();
                    }}
                  >
                    <FormattedMessage id="stripes-acq-components.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
          <Switch>
            <PermissionedRoute
              path={INVOICE_EDIT_ROUTE}
              perm="ui-invoice.invoice.edit"
              returnLink={RETURN_LINK}
              returnLinkLabelId={RETURN_LINK_LABEL_ID}
            >
              <EditInvoice />
            </PermissionedRoute>
            <PermissionedRoute
              path={INVOICE_CREATE_ROUTE}
              perm="ui-invoice.invoice.edit"
              returnLink={RETURN_LINK}
              returnLinkLabelId={RETURN_LINK_LABEL_ID}
            >
              <CreateInvoice />
            </PermissionedRoute>
            <PermissionedRoute
              path={INVOICE_VOUCHER_EXPORT_ROUTE}
              perm="ui-invoice.voucher.export.execute"
              returnLink={RETURN_LINK}
              returnLinkLabelId={RETURN_LINK_LABEL_ID}
            >
              <VoucherExport />
            </PermissionedRoute>
            <PermissionedRoute
              path={INVOICE_LINE_EDIT_ROUTE}
              perm="ui-invoice.invoice.edit"
              returnLink={RETURN_LINK}
              returnLinkLabelId={RETURN_LINK_LABEL_ID}
            >
              <EditInvoiceLine />
            </PermissionedRoute>
            <PermissionedRoute
              path={INVOICE_LINE_CREATE_ROUTE}
              perm="ui-invoice.invoice.edit"
              returnLink={RETURN_LINK}
              returnLinkLabelId={RETURN_LINK_LABEL_ID}
            >
              <CreateInvoiceLine />
            </PermissionedRoute>
            <Route
              path={INVOICE_VOUCHER_ROUTE}
              component={Voucher}
            />
            <PermissionedRoute
              path={INVOICE_LINE_SEQUENCE_ROUTE}
              perm="ui-invoice.invoice.create"
              returnLink={RETURN_LINK}
              returnLinkLabelId={RETURN_LINK_LABEL_ID}
            >
              <InvoiceLinesSequence />
            </PermissionedRoute>
            <Route
              path={INVOICE_ROUTE}
              component={InvoicesListContainer}
            />
          </Switch>
        </HasCommand>
      </CommandList>
      {isOpen && (
        <AcqKeyboardShortcutsModal
          onClose={toggleModal}
        />
      )}
    </>
  );
};

export default Invoices;
