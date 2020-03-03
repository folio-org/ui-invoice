import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
  Col,
  Row,
  ExpandAllButton,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { SECTIONS_VOUCHER } from '../constants';
import VoucherDetails from './VoucherDetails';
import VoucherLinesDetails from './VoucherLinesDetails';

const VoucherView = ({ voucher, voucherLines }) => {
  const [sections, setSections] = useState({});

  const expandAll = useCallback(
    (allSections) => {
      setSections(allSections);
    },
    [],
  );

  return (
    <>
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>
      <AccordionSet accordionStatus={sections}>
        <Accordion
          label={<FormattedMessage id="ui-invoice.voucher.voucherTitle" />}
          id={SECTIONS_VOUCHER.VOUCHER}
        >
          {voucher.metadata && <ViewMetaData metadata={voucher.metadata} />}
          <VoucherDetails voucher={voucher} />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-invoice.voucher.voucherLinesTitle" />}
          id={SECTIONS_VOUCHER.VOUCHER_LINES}
        >
          <VoucherLinesDetails
            voucherLines={voucherLines}
            currency={voucher.invoiceCurrency}
          />
        </Accordion>
      </AccordionSet>
    </>
  );
};

VoucherView.propTypes = {
  voucher: PropTypes.object.isRequired,
  voucherLines: PropTypes.arrayOf(PropTypes.object),
};

VoucherView.defaultProps = {
  voucherLines: [],
};

export default VoucherView;
