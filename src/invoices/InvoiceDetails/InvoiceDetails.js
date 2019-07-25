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
} from '@folio/stripes/components';

import {
  expandAll,
  toggleSection,
} from '../../common/utils';
import {
  SECTIONS_INVOICE,
} from '../constants';
import ActionMenu from './ActionMenu';
import Information from './Information';
import InvoiceLines, { InvoiceLinesActions } from './InvoiceLines';
import styles from './InvoiceDetails.css';

class InvoiceDetails extends Component {
  static propTypes = {
    addLines: PropTypes.func.isRequired,
    createLine: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired,
    deleteInvoice: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.expandAll = expandAll.bind(this);
    this.toggleSection = toggleSection.bind(this);
  }

  state = {
    sections: {},
    showConfirmDelete: false,
    invoiceLineTotal: 0,
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

  onInvoiceLinesLoaded = (invoiceLineTotal = 0) => this.setState({ invoiceLineTotal });

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
    } = this.props;
    const { sections, showConfirmDelete, invoiceLineTotal } = this.state;
    const vendorInvoiceNo = invoice.vendorInvoiceNo;

    const paneTitle = (
      <FormattedMessage
        id="ui-invoice.invoice.details.paneTitle"
        values={{ vendorInvoiceNo }}
      />
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
              adjustmentsTotal={get(invoice, 'adjustmentsTotal')}
              approvalDate={get(invoice, 'approvalDate')}
              approvedBy={get(invoice, 'approvedBy')}
              createdDate={get(invoice, 'metadata.createdDate')}
              updatedDate={get(invoice, 'metadata.updatedDate')}
              invoiceDate={get(invoice, 'invoiceDate')}
              paymentTerms={get(invoice, 'paymentTerms')}
              status={get(invoice, 'status')}
              subTotal={get(invoice, 'subTotal')}
              total={get(invoice, 'total')}
              source={get(invoice, 'source')}
              metadata={get(invoice, 'metadata')}
            />
          </Accordion>
          <Accordion
            label={
              <div className={styles.invoiceLinesLabel}>
                <FormattedMessage id="ui-invoice.invoice.details.lines.title" />
                {!sections[SECTIONS_INVOICE.LINES] && (
                  <div className={styles.invoiceLinesCount}>
                    {invoiceLineTotal}
                  </div>
                )}
              </div>
            }
            id={SECTIONS_INVOICE.LINES}
            displayWhenOpen={this.renderLinesActions()}
          >
            <InvoiceLines
              invoiceId={invoice.id}
              onInvoiceLinesLoaded={this.onInvoiceLinesLoaded}
            />
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
