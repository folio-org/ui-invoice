import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { Paneset } from '@folio/stripes/components';
import {
  stripesConnect,
} from '@folio/stripes/core';

import { LoadingPane } from '../../../common/components';
import {
  invoiceResource,
  VOUCHER_BY_ID,
  configVoucherNumber,
} from '../../../common/resources';
import { getIsAllowVoucherNumberEdit } from '../utils';
import VoucherEditForm from './VoucherEditForm';

const VoucherEditContainer = ({ match: { params }, mutator, resources }) => {
  const [voucher, setVoucher] = useState();
  const vendorInvoiceNo = get(resources, ['invoice', 'records', 0, 'vendorInvoiceNo']);
  const isAllowVoucherNumberEdit = getIsAllowVoucherNumberEdit(get(resources, ['configVoucherNumber', 'records', 0]));

  useEffect(() => {
    mutator.voucher.GET({
      params: {
        query: `voucherId=${params.voucherId}`,
      },
    }).then(response => setVoucher(response));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeVoucherForm = useCallback(
    () => {
      const _path = `/invoice/view/${params.id}/voucher/${params.voucherId}/view`;

      mutator.query.update({ _path });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id],
  );

  const saveVoucher = useCallback(
    (vouch) => {
      mutator.voucher.PUT(vouch).then(closeVoucherForm);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutator.voucher],
  );

  if (!(voucher && vendorInvoiceNo)) {
    return (
      <Paneset>
        <LoadingPane onClose={closeVoucherForm} />
      </Paneset>
    );
  }

  return (
    <VoucherEditForm
      initialValues={voucher}
      onSubmit={saveVoucher}
      onCancel={closeVoucherForm}
      vendorInvoiceNo={vendorInvoiceNo}
      isAllowVoucherNumberEdit={isAllowVoucherNumberEdit}
    />
  );
};

VoucherEditContainer.manifest = Object.freeze({
  voucher: {
    ...VOUCHER_BY_ID,
    accumulate: true,
  },
  invoice: invoiceResource,
  configVoucherNumber,
  query: {},
});

VoucherEditContainer.propTypes = {
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(VoucherEditContainer);
