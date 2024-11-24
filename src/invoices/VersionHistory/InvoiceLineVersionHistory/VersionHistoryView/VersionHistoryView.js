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

import { VersionHistoryAdjustments } from '../../components';
import { VersionHistoryFundDistributions } from './VersionHistoryFundDistributions';
import { VersionHistoryViewInformation } from './VersionHistoryViewInformation';

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
  const fundDistributions = get(version, 'fundDistributions', []);

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
            id="information"
            label={<FormattedMessage id="ui-invoice.invoiceLineInformation" />}
          >
            <VersionHistoryViewInformation version={version} />
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
          {
            Boolean(fundDistributions.length) && (
              <Accordion
                label={<FormattedMessage id="ui-invoice.fundDistribution" />}
                id="fundDistributions"
              >
                <VersionHistoryFundDistributions version={version} />
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
