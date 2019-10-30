import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Pane,
  Row,
  PaneMenu,
  IconButton,
} from '@folio/stripes/components';
import { FundDistributionView } from '@folio/stripes-acq-components';

import {
  calculateAdjustmentAmount,
  expandAll,
  isPayable,
  IS_EDIT_POST_APPROVAL,
  toggleSection,
} from '../../common/utils';
import { INVOICE_STATUS } from '../../common/constants';
import {
  SECTIONS_INVOICE,
} from '../constants';
import ActionMenu from './ActionMenu';
import {
  ApproveInvoiceAction,
  PayInvoiceAction,
} from './InvoiceActions';
import Information from './Information';
import InvoiceLines, { InvoiceLinesActions } from './InvoiceLines';
import VendorDetails from './VendorDetails';
import VoucherInformationContainer from './VoucherInformation';
import DocumentsDetails from './DocumentsDetails';
import AdjustmentsDetails from '../AdjustmentsDetails';
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
    tagsToggle: PropTypes.func.isRequired,
    tagsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    invoiceTotalUnits: 0,
    tagsEnabled: false,
  };

  constructor(props, context) {
    super(props, context);
    this.expandAll = expandAll.bind(this);
    this.toggleSection = toggleSection.bind(this);
  }

  state = {
    sections: {
      [SECTIONS_INVOICE.DOCUMENTS]: false,
    },
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

  renderLinesActions = () => {
    const { invoice } = this.props;

    return (
      <InvoiceLinesActions
        createLine={this.props.createLine}
        addLines={this.props.addLines}
        isDisabled={IS_EDIT_POST_APPROVAL(invoice.id, invoice.status)}
      />
    );
  }

  mountDeleteLineConfirm = () => this.setState({ showConfirmDelete: true });

  unmountDeleteConfirm = () => this.setState({ showConfirmDelete: false });

  render() {
    const {
      deleteInvoice,
      onClose,
      invoice,
      totalInvoiceLines,
      invoiceTotalUnits,
      tagsEnabled,
      tagsToggle,
    } = this.props;
    const { sections, showConfirmDelete } = this.state;
    const vendorInvoiceNo = invoice.vendorInvoiceNo;
    const showVoucherInformation = [INVOICE_STATUS.approved, INVOICE_STATUS.paid].includes(invoice.status);
    const tags = get(invoice, 'tags.tagList', []);
    const adjustments = get(invoice, 'adjustments', []);
    const fundDistributions = adjustments.reduce((acc, adjustment) => {
      if (adjustment.fundDistributions) {
        adjustment.fundDistributions.forEach((distr) => {
          acc.push({
            ...distr,
            adjustmentDescription: adjustment.description,
            totalAmount: calculateAdjustmentAmount(adjustment, invoice.subTotal),
          });
        });
      }

      return acc;
    }, []);

    const paneTitle = (
      <FormattedMessage
        id="ui-invoice.invoice.details.paneTitle"
        values={{ vendorInvoiceNo }}
      />
    );

    const lastMenu = (
      <PaneMenu>
        {tagsEnabled && (
          <FormattedMessage id="ui-invoice.showTags">
            {(title) => (
              <IconButton
                data-test-invoice-tags-action
                ariaLabel={title}
                badgeCount={tags.length}
                icon="tag"
                id="clickable-show-tags"
                onClick={tagsToggle}
                title={title}
              />
            )}
          </FormattedMessage>
        )}
      </PaneMenu>
    );

    return (
      <Pane
        id="pane-invoiceDetails"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
        actionMenu={this.renderActionMenu}
        lastMenu={lastMenu}
      >
        <Row end="xs">
          <Col xs={12}>
            {
              totalInvoiceLines > 0 && isPayable(invoice.status) && (
                <PayInvoiceAction invoice={invoice} />
              )
            }
            {
              totalInvoiceLines > 0 && !IS_EDIT_POST_APPROVAL(invoice.id, invoice.status) && (
                <ApproveInvoiceAction invoice={invoice} />
              )
            }
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
              currency={invoice.currency}
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
            id={SECTIONS_INVOICE.FUND_DISTRIBUTION}
            label={<FormattedMessage id="ui-invoice.fundDistribution" />}
          >
            <FundDistributionView
              currency={invoice.currency}
              fundDistributions={fundDistributions}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-invoice.adjustments" />}
            id={SECTIONS_INVOICE.ADJUSTMENTS}
          >
            <AdjustmentsDetails
              adjustments={adjustments}
              currency={invoice.currency}
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
            <VoucherInformationContainer invoiceId={invoice.id} />
          }
          <Accordion
            label={<FormattedMessage id="ui-invoice.linksAndDocuments" />}
            id={SECTIONS_INVOICE.DOCUMENTS}
          >
            <DocumentsDetails />
          </Accordion>

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
