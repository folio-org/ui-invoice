import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Row,
} from '@folio/stripes/components';

import { VersionHistoryViewInformation } from './VersionHistoryViewInformation';
import { VersionHistoryViewInvoiceLine } from './VersionHistoryViewInvoiceLine';
import { VersionHistoryViewVendorDetails } from './VersionHistoryViewVendorDetails';
import { VersionHistoryViewExtendedInformation } from './VersionHistoryViewExtendedInformation';
import { VersionHistoryAdjustments } from '../../components';

export function VersionHistoryView({ version = {} }) {
  const accordionStatusRef = useRef();

  const shortcuts = [
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  const adjustments = get(version, 'adjustments', []);

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <AccordionStatus ref={accordionStatusRef}>
        <Row end="xs">
          <Col xs={2}>
            <ExpandAllButton />
          </Col>
        </Row>
        <AccordionSet id="invoice-details-accordion-set">
          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.information.title" />}
            id="information"
          >
            <VersionHistoryViewInformation version={version} />
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.lines.title" />}
            id="invoiceLines"
          >
            <VersionHistoryViewInvoiceLine version={version} />
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-invoice.invoice.details.vendor.title" />}
            id="vendorDetails"
          >
            <VersionHistoryViewVendorDetails version={version} />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-invoice.extendedInformation" />}
            id="extendedInformation"
          >
            <VersionHistoryViewExtendedInformation version={version} />
          </Accordion>
          {
            Boolean(adjustments.length) && (
              <Accordion
                label={<FormattedMessage id="ui-invoice.invoice.details.accordion.adjustments" />}
                id="adjustments"
              >
                <VersionHistoryAdjustments
                  adjustments={adjustments}
                  currency={version?.currency}
                />
              </Accordion>
            )
          }
        </AccordionSet>
      </AccordionStatus>
    </HasCommand>
  );
}

VersionHistoryView.propTypes = {
  version: PropTypes.object.isRequired,
};
