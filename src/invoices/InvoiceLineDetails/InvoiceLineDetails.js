import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import {
  FundDistributionView,
  handleKeyCommand,
  TagsBadge,
  useModalToggle,
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

const InvoiceLineDetails = ({
  closeInvoiceLine,
  deleteInvoiceLine,
  goToEditInvoiceLine,
  invoiceLine,
  invoiceStatus,
  tagsToggle,
  currency,
  poLine,
}) => {
  const [showConfirmDelete, toggleDeleteConfirmation] = useModalToggle();
  const accordionStatusRef = useRef();
  const stripes = useStripes();

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = ({ onToggle }) => {
    const isDeletable = !(isPayable(invoiceStatus) || isPaid(invoiceStatus));

    return (
      <ActionMenu
        onEdit={() => {
          onToggle();
          goToEditInvoiceLine();
        }}
        onDelete={() => {
          onToggle();
          toggleDeleteConfirmation();
        }}
        isDeletable={isDeletable}
      />
    );
  };

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

  const shortcuts = [
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-invoice.invoice.edit')) goToEditInvoiceLine();
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
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        id="pane-invoiceLineDetails"
        defaultWidth="fill"
        dismissible
        onClose={closeInvoiceLine}
        paneTitle={paneTitle}
        actionMenu={renderActionMenu}
        lastMenu={lastMenu}
      >
        <AccordionStatus ref={accordionStatusRef}>
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
            onCancel={toggleDeleteConfirmation}
            onConfirm={deleteInvoiceLine}
            open
          />
        )}
      </Pane>
    </HasCommand>
  );
};

InvoiceLineDetails.propTypes = {
  closeInvoiceLine: PropTypes.func.isRequired,
  deleteInvoiceLine: PropTypes.func.isRequired,
  goToEditInvoiceLine: PropTypes.func.isRequired,
  invoiceLine: PropTypes.object.isRequired,
  invoiceStatus: PropTypes.string.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  currency: PropTypes.string,
  poLine: PropTypes.object,
};

InvoiceLineDetails.defaultProps = {
  poLine: {},
};

export default InvoiceLineDetails;
