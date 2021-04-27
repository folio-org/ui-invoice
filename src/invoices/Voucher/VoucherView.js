import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Accordion,
  Col,
  Row,
  ExpandAllButton,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { SECTIONS_VOUCHER } from '../constants';
import VoucherDetails from './VoucherDetails';
import VoucherLinesDetails from './VoucherLinesDetails';

const VoucherView = forwardRef(({ voucher, voucherLines }, ref) => (
  <AccordionStatus ref={ref}>
    <Row end="xs">
      <Col xs={12}>
        <ExpandAllButton />
      </Col>
    </Row>
    <AccordionSet>
      <Accordion
        label={<FormattedMessage id="ui-invoice.voucher.voucherTitle" />}
        id={SECTIONS_VOUCHER.voucher}
      >
        {voucher.metadata && <ViewMetaData metadata={voucher.metadata} />}
        <VoucherDetails
          voucher={voucher}
          withVendorAddress
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-invoice.voucher.voucherLinesTitle" />}
        id={SECTIONS_VOUCHER.voucherLines}
      >
        <VoucherLinesDetails
          voucherLines={voucherLines}
          currency={voucher.systemCurrency}
        />
      </Accordion>
    </AccordionSet>
  </AccordionStatus>
));

VoucherView.propTypes = {
  voucher: PropTypes.object.isRequired,
  voucherLines: PropTypes.arrayOf(PropTypes.object),
};

VoucherView.defaultProps = {
  voucherLines: [],
};

export default VoucherView;
