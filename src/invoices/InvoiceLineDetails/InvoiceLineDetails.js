import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Pane,
  Row,
  PaneMenu,
} from '@folio/stripes/components';

import {
  FundDistributionView,
  TagsBadge,
} from '@folio/stripes-acq-components';

import {
  isPayable,
  isPaid,
} from '../../common/utils';
import ActionMenu from './ActionMenu';
import InvoiceLineInformation from './InvoiceLineInformation';
import {
  SECTIONS_INVOICE_LINE,
} from '../constants';
import AdjustmentsDetails from '../AdjustmentsDetails';

class InvoiceLineDetails extends Component {
  static propTypes = {
    closeInvoiceLine: PropTypes.func.isRequired,
    deleteInvoiceLine: PropTypes.func.isRequired,
    goToEditInvoiceLine: PropTypes.func.isRequired,
    invoiceLine: PropTypes.object.isRequired,
    invoiceStatus: PropTypes.string.isRequired,
    tagsToggle: PropTypes.func.isRequired,
    currency: PropTypes.string,
    poLine: PropTypes.object,
  };

  static defaultProps = {
    poLine: {},
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      showConfirmDelete: false,
    };
  }

  renderActionMenu = ({ onToggle }) => {
    const { goToEditInvoiceLine, invoiceStatus } = this.props;
    const isDeletable = !(isPayable(invoiceStatus) || isPaid(invoiceStatus));

    return (
      <ActionMenu
        onEdit={() => {
          onToggle();
          goToEditInvoiceLine();
        }}
        onDelete={() => {
          onToggle();
          this.mountDeleteLineConfirm();
        }}
        isDeletable={isDeletable}
      />
    );
  }

  mountDeleteLineConfirm = () => this.setState({ showConfirmDelete: true });

  unmountDeleteConfirm = () => this.setState({ showConfirmDelete: false });

  render() {
    const {
      closeInvoiceLine,
      currency,
      deleteInvoiceLine,
      invoiceLine,
      poLine,
      tagsToggle,
    } = this.props;
    const { showConfirmDelete } = this.state;
    const { invoiceLineNumber, adjustments } = invoiceLine;
    const tags = get(invoiceLine, ['tags', 'tagList'], []);
    const fundDistributions = get(invoiceLine, 'fundDistributions');
    const total = get(invoiceLine, 'total', 0);

    const paneTitle = (
      <FormattedMessage
        id="ui-invoice.invoiceLine.paneTitle.view"
        values={{ invoiceLineNumber }}
      />
    );

    const lastMenu = (
      <PaneMenu>
        <TagsBadge
          tagsToggle={tagsToggle}
          tagsQuantity={tags.length}
        />
      </PaneMenu>
    );

    return (
      <Pane
        id="pane-invoiceLineDetails"
        defaultWidth="fill"
        dismissible
        onClose={closeInvoiceLine}
        paneTitle={paneTitle}
        actionMenu={this.renderActionMenu}
        lastMenu={lastMenu}
      >
        <AccordionStatus>
          <Row end="xs">
            <Col xs={12}>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <Accordion
              id={SECTIONS_INVOICE_LINE.information}
              label={<FormattedMessage id="ui-invoice.invoiceLineInformation" />}
            >
              <InvoiceLineInformation
                currency={currency}
                invoiceLine={invoiceLine}
                poLine={poLine}
              />
            </Accordion>
            <Accordion
              id={SECTIONS_INVOICE_LINE.fundDistribution}
              label={<FormattedMessage id="ui-invoice.fundDistribution" />}
            >
              <FundDistributionView
                currency={currency}
                fundDistributions={fundDistributions}
                totalAmount={total}
              />
            </Accordion>
            <Accordion
              id={SECTIONS_INVOICE_LINE.adjustments}
              label={<FormattedMessage id="ui-invoice.adjustments" />}
            >
              <AdjustmentsDetails
                adjustments={adjustments}
                currency={currency}
              />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
        {showConfirmDelete && (
          <ConfirmationModal
            id="delete-invoice-line-confirmation"
            confirmLabel={<FormattedMessage id="ui-invoice.invoiceLine.delete.confirmLabel" />}
            heading={<FormattedMessage id="ui-invoice.invoiceLine.delete.heading" values={{ invoiceLineNumber }} />}
            message={<FormattedMessage id="ui-invoice.invoiceLine.delete.message" />}
            onCancel={this.unmountDeleteConfirm}
            onConfirm={deleteInvoiceLine}
            open
          />
        )}
      </Pane>
    );
  }
}

export default InvoiceLineDetails;
