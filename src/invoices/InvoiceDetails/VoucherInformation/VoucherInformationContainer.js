import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Icon,
} from '@folio/stripes/components';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  VOUCHER,
  VOUCHER_LINES,
} from '../../../common/resources';
import { SECTIONS_INVOICE } from '../../constants';
import VoucherInformation from './VoucherInformation';

export const VoucherInformationContainer = ({ invoiceId, mutator, resources, location }) => {
  const voucher = get(resources, ['voucher', 'records', 0], {});
  const voucherLines = get(resources, ['voucherLines', 'records'], []);
  const isLoading = !get(resources, ['voucher', 'hasLoaded']);
  const voucherViewPath = `/invoice/view/${invoiceId}/voucher/${voucher.id}/view`;

  const viewVoucherButton = (
    <Button
      data-test-view-voucher-button
      disabled={!voucher.id}
      to={{
        pathname: voucherViewPath,
        search: location.search,
      }}
    >
      <FormattedMessage id="ui-invoice.invoice.details.voucher.button" />
    </Button>
  );

  useEffect(() => {
    mutator.voucher.reset();
    mutator.voucherLines.reset();
    mutator.voucher.GET().then(response => {
      const voucherId = get(response, '0.id');

      if (voucherId) {
        mutator.voucherLines.GET({
          params: {
            limit: `${LIMIT_MAX}`,
            query: `voucherId==${voucherId}`,
          },
        });
      }
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [invoiceId]);

  if (isLoading) {
    return (
      <Icon
        icon="spinner-ellipsis"
        width="100px"
      />
    );
  }

  return (
    <Accordion
      label={<FormattedMessage id="ui-invoice.invoice.details.voucher.title" />}
      id={SECTIONS_INVOICE.voucher}
      displayWhenOpen={viewVoucherButton}
    >
      <VoucherInformation
        voucher={voucher}
        voucherLines={voucherLines}
      />
    </Accordion>
  );
};

VoucherInformationContainer.manifest = {
  voucher: VOUCHER,
  voucherLines: {
    ...VOUCHER_LINES,
    fetch: false,
    accumulate: true,
  },
  query: {},
};

VoucherInformationContainer.propTypes = {
  invoiceId: PropTypes.string.isRequired,
  mutator: PropTypes.shape({
    voucher: PropTypes.object.isRequired,
    voucherLines: PropTypes.object.isRequired,
  }).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  resources: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(VoucherInformationContainer));
