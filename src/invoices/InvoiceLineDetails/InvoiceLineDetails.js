import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Pane,
  Row,
} from '@folio/stripes/components';

import ActionMenu from './ActionMenu';
import InvoiceLineInformation from './InvoiceLineInformation';
import {
  SECTIONS_INVOICE_LINE,
} from '../constants';
import {
  expandAll,
  toggleSection,
} from '../../common/utils';
import AdjustmentsDetails from '../AdjustmentsDetails';

class InvoiceLineDetails extends Component {
  static propTypes = {
    closeInvoiceLine: PropTypes.func.isRequired,
    deleteInvoiceLine: PropTypes.func.isRequired,
    goToEditInvoiceLine: PropTypes.func.isRequired,
    invoiceLine: PropTypes.object.isRequired,
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
    const { goToEditInvoiceLine } = this.props;

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
      />
    );
  }

  mountDeleteLineConfirm = () => this.setState({ showConfirmDelete: true });

  unmountDeleteConfirm = () => this.setState({ showConfirmDelete: false });

  render() {
    const {
      closeInvoiceLine,
      deleteInvoiceLine,
      invoiceLine,
    } = this.props;
    const { sections, showConfirmDelete } = this.state;
    const { invoiceLineNumber, adjustments } = invoiceLine;

    const paneTitle = (
      <FormattedMessage
        id="ui-invoice.invoiceLine.paneTitle.view"
        values={{ invoiceLineNumber }}
      />
    );

    return (
      <Pane
        id="pane-invoiceLineDetails"
        defaultWidth="fill"
        dismissible
        onClose={closeInvoiceLine}
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
            id={SECTIONS_INVOICE_LINE.invoiceLineInformation}
            label={<FormattedMessage id="ui-invoice.invoiceLineInformation" />}
          >
            <InvoiceLineInformation invoiceLine={invoiceLine} />
          </Accordion>
          <Accordion
            id={SECTIONS_INVOICE_LINE.fundDistribution}
            label={<FormattedMessage id="ui-invoice.fundDistribution" />}
          />
          <Accordion
            id={SECTIONS_INVOICE_LINE.adjustments}
            label={<FormattedMessage id="ui-invoice.adjustments" />}
          >
            <AdjustmentsDetails adjustments={adjustments} />
          </Accordion>
        </AccordionSet>
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
