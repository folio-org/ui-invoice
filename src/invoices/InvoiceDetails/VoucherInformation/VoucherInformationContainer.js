import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

import {
  VOUCHER,
  VOUCHER_LINES,
} from '../../../common/resources';
import VoucherInformation from './VoucherInformation';

const VoucherInformationContainer = ({ invoiceId, mutator, resources }) => {
  const voucher = get(resources, ['voucher', 'records', 0], {});
  const voucherLines = get(resources, ['voucherLines', 'records', 0], []);
  const isLoading = !get(resources, ['voucher', 'hasLoaded']);

  useEffect(() => {
    mutator.voucher.reset();
    // mutator.voucherLines.reset();

    mutator.voucher.GET().then(response => {
      const voucherId = response[0].id;

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
    <VoucherInformation
      voucher={voucher}
      voucherLines={voucherLines}
    />
  );
};

VoucherInformationContainer.manifest = {
  voucher: VOUCHER,
  voucherLines: {
    ...VOUCHER_LINES,
    fetch: false,
    accumulate: true,
  },
};

VoucherInformationContainer.propTypes = {
  // invoiceId prop is used in manifest
  // eslint-disable-next-line react/no-unused-prop-types
  invoiceId: PropTypes.string.isRequired,
  mutator: PropTypes.shape({
    voucher: PropTypes.object.isRequired,
    voucherLines: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(VoucherInformationContainer);
