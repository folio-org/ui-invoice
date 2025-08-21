import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useHistory,
  useParams,
  useLocation,
} from 'react-router-dom';

import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
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
  IconButton,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import {
  FundDistributionView,
  handleKeyCommand,
  TagsBadge,
  useModalToggle,
  VersionHistoryButton,
} from '@folio/stripes-acq-components';

import { INVOICE_ROUTE } from '../../common/constants';
import {
  isPayable,
  isPaid,
} from '../../common/utils';
import { SECTIONS_INVOICE_LINE } from '../constants';
import AdjustmentsDetails from '../AdjustmentsDetails';
import ActionMenu from './ActionMenu';
import InvoiceLineInformation from './InvoiceLineInformation';
import { OtherRelatedInvoiceLines } from './OtherRelatedInvoiceLines';
import { ReceivingHistory } from './ReceivingHistory';

const DEFAULT_PROPS = {
  poLine: {},
  invoiceLine: {},
};

const InvoiceLineDetails = ({
  closeInvoiceLine,
  deleteInvoiceLine,
  exchangeRate,
  goToEditInvoiceLine,
  vendorInvoiceNo,
  vendorCode,
  invoiceLine = DEFAULT_PROPS.invoiceLine,
  invoiceStatus,
  tagsToggle,
  currency,
  poLine = DEFAULT_PROPS.poLine,
}) => {
  const history = useHistory();
  const { search } = useLocation();
  const stripes = useStripes();
  const intl = useIntl();
  const { id: invoiceId, lineId: invoiceLineId } = useParams();

  const [showConfirmDelete, toggleDeleteConfirmation] = useModalToggle();
  const accordionStatusRef = useRef();

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
  const paneSubTitle = `${vendorInvoiceNo} - ${vendorCode}`;

  const openVersionHistory = useCallback(() => {
    history.push({
      pathname: `${INVOICE_ROUTE}/view/${invoiceId}/line/${invoiceLineId}/view/versions`,
      search,
    });
  }, [history, invoiceId, invoiceLineId, search]);

  const paneTitle = (
    <FormattedMessage
      id="ui-invoice.invoiceLine.paneTitle.view"
      values={{ invoiceLineNumber }}
    />
  );

  const firstMenu = (
    <PaneMenu>
      <IconButton
        icon="arrow-left"
        id="clickable-back-to-invoice"
        onClick={closeInvoiceLine}
        title={intl.formatMessage({ id: 'ui-invoice.label.backToInvoice' })}
      />
    </PaneMenu>
  );

  const lastMenu = (
    <PaneMenu>
      <TagsBadge
        tagsToggle={tagsToggle}
        tagsQuantity={tags.length}
      />
      <VersionHistoryButton onClick={openVersionHistory} />
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
        paneTitle={paneTitle}
        paneSub={paneSubTitle}
        actionMenu={renderActionMenu}
        firstMenu={firstMenu}
        lastMenu={lastMenu}
      >
        <TitleManager record={invoiceLineNumber} />
        <AccordionStatus ref={accordionStatusRef}>
          <Row end="xs">
            <Col xs={12}>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet id="invoice-line-details-accordion-set">
            <Accordion
              id={SECTIONS_INVOICE_LINE.information}
              label={<FormattedMessage id="ui-invoice.invoiceLineInformation" />}
            >
              <InvoiceLineInformation
                currency={currency}
                exchangeRate={exchangeRate}
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
            <OtherRelatedInvoiceLines
              invoiceLine={invoiceLine}
              poLine={poLine}
            />
            <ReceivingHistory
              poLine={poLine}
            />
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
  exchangeRate: PropTypes.number,
  goToEditInvoiceLine: PropTypes.func.isRequired,
  invoiceLine: PropTypes.object.isRequired,
  invoiceStatus: PropTypes.string.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  currency: PropTypes.string,
  poLine: PropTypes.object,
  vendorInvoiceNo: PropTypes.string,
  vendorCode: PropTypes.string,
};

export default InvoiceLineDetails;
