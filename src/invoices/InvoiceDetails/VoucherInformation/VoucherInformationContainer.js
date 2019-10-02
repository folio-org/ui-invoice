import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Icon,
} from '@folio/stripes/components';

import {
  VOUCHER,
  VOUCHER_LINES,
} from '../../../common/resources';
import { SECTIONS_INVOICE } from '../../constants';
import VoucherInformation from './VoucherInformation';

const VoucherInformationContainer = ({ invoiceId, mutator, resources }) => {
  const voucher = get(resources, ['voucher', 'records', 0], {});
  const voucherLines = get(resources, ['voucherLines', 'records'], []);
  const isLoading = !get(resources, ['voucher', 'hasLoaded']);
  const voucherViewPath = `/invoice/view/${invoiceId}/voucher/${voucher.id}/view`;

  const viewVoucherButton = (
    <Button
      data-test-view-voucher-button
      disabled={!voucher.id}
      to={voucherViewPath}
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
            query: `voucherId==${voucherId}`,
          },
        });
      }
    });
  }, [invoiceId]);

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
      id={SECTIONS_INVOICE.VOUCHER}
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
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(VoucherInformationContainer);
