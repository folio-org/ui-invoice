import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Pane,
  Row,
} from '@folio/stripes/components';

import {
  expandAll,
  toggleSection,
} from '../../common/utils';
import { INVOICE_STATUS } from '../../common/constants';
import {
  SECTIONS_INVOICE,
} from '../constants';
import ActionMenu from './ActionMenu';
import Information from './Information';
import InvoiceLines, { InvoiceLinesActions } from './InvoiceLines';
import VendorDetails from './VendorDetails';
import VoucherInformationContainer from './VoucherInformation';
import styles from './InvoiceDetails.css';

class InvoiceDetails extends Component {
  static propTypes = {
    addLines: PropTypes.func.isRequired,
    createLine: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired,
    deleteInvoice: PropTypes.func.isRequired,
    totalInvoiceLines: PropTypes.number.isRequired,
    invoiceTotalUnits: PropTypes.number,
  };

  static defaultProps = {
    invoiceTotalUnits: 0,
  };

  constructor(props, context) {
    super(props, context);
    this.expandAll = expandAll.bind(this);
    this.toggleSection = toggleSection.bind(this);
  }

  state = {
    sections: {},
    showConfirmDelete: false,
  };

  renderActionMenu = ({ onToggle }) => {
    const { onEdit } = this.props;

    return (
      <ActionMenu
        onEdit={() => {
          onToggle();
          onEdit();
        }}
        onDelete={() => {
          onToggle();
          this.mountDeleteLineConfirm();
        }}
      />
    );
  }

  renderLinesActions = () => (
    <InvoiceLinesActions
      createLine={this.props.createLine}
      addLines={this.props.addLines}
    />
  );

  mountDeleteLineConfirm = () => this.setState({ showConfirmDelete: true });

  unmountDeleteConfirm = () => this.setState({ showConfirmDelete: false });

  render() {
    const {
      deleteInvoice,
      onClose,
      invoice,
      totalInvoiceLines,
      invoiceTotalUnits,
    } = this.props;
    const { sections, showConfirmDelete } = this.state;
    const vendorInvoiceNo = invoice.vendorInvoiceNo;
    const showVoucherInformation = [INVOICE_STATUS.approved, INVOICE_STATUS.paid].includes(invoice.status);

    const paneTitle = (
      <FormattedMessage
        id="ui-invoice.invoice.details.paneTitle"
        values={{ vendorInvoiceNo }}
      />
    );

    const viewVoucherButton = (
      <Button>
        <FormattedMessage id="ui-invoice.invoice.details.voucher.button" />
      </Button>
    );

    return (
      <Pane
        id="pane-invoiceDetails"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
        actionMenu={this.renderActionMenu}
      >
        <Row end="xs">
          <Col xs={12}>
            <ExpandAllButton
              accordionStatus={sections}
              onToggle={this.expandAll}
            />
          </Col>
        </Row>
        <AccordionSet
          accordionStatus={sections}
          onToggle={this.toggleSection}
        >
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.information.title" />}
            id={SECTIONS_INVOICE.INFORMATION}
          >
            <Information
              adjustmentsTotal={invoice.adjustmentsTotal}
              approvalDate={invoice.approvalDate}
              approvedBy={invoice.approvedBy}
              invoiceDate={invoice.invoiceDate}
              paymentDue={invoice.paymentDue}
              paymentTerms={invoice.paymentTerms}
              status={invoice.status}
              subTotal={invoice.subTotal}
              total={invoice.total}
              source={invoice.source}
              metadata={invoice.metadata}
              billTo={invoice.billTo}
              invoiceTotalUnits={invoiceTotalUnits}
              acqUnits={invoice.acqUnitIds}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.lines.title" />}
            id={SECTIONS_INVOICE.LINES}
            displayWhenOpen={this.renderLinesActions()}
            displayWhenClosed={
              <div className={styles.invoiceLinesCount}>
                {totalInvoiceLines}
              </div>
            }
          >
            <InvoiceLines
              currency={invoice.currency}
              invoiceId={invoice.id}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.vendor.title" />}
            id={SECTIONS_INVOICE.VENDOR_DETAILS}
          >
            <VendorDetails
              vendorInvoiceNo={vendorInvoiceNo}
              vendorId={invoice.vendorId}
              accountingCode={invoice.accountingCode}
            />
          </Accordion>
          {showVoucherInformation &&
            <Accordion
              label={<FormattedMessage id="ui-invoice.invoice.details.voucher.title" />}
              id={SECTIONS_INVOICE.VOUCHER}
              displayWhenOpen={viewVoucherButton}
            >
              <VoucherInformationContainer invoiceId={invoice.id} />
            </Accordion>
          }
        </AccordionSet>
        {showConfirmDelete && (
          <ConfirmationModal
            id="delete-invoice-confirmation"
            confirmLabel={<FormattedMessage id="ui-invoice.invoice.delete.confirmLabel" />}
            heading={<FormattedMessage id="ui-invoice.invoice.delete.heading" values={{ vendorInvoiceNo }} />}
            message={<FormattedMessage id="ui-invoice.invoice.delete.message" />}
            onCancel={this.unmountDeleteConfirm}
            onConfirm={deleteInvoice}
            open
          />
        )}
      </Pane>
    );
  }
}

export default InvoiceDetails;
