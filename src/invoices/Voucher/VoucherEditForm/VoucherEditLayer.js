import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { Layer } from '@folio/stripes/components';
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

const VoucherEditLayer = ({ match: { params }, mutator, resources }) => {
  const voucher = get(resources, ['voucher', 'records', 0]);
  const vendorInvoiceNo = get(resources, ['invoice', 'records', 0, 'vendorInvoiceNo']);
  const isAllowVoucherNumberEdit = getIsAllowVoucherNumberEdit(get(resources, ['configVoucherNumber', 'records', 0]));
  const isLoading = !get(resources, ['voucher', 'hasLoaded']);
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

  if (isLoading) {
    return (
      <Layer isOpen>
        <LoadingPane onClose={closeVoucherForm} />
      </Layer>
    );
  }

  return (
    <Layer isOpen>
      <VoucherEditForm
        initialValues={voucher}
        onSubmit={saveVoucher}
        onCancel={closeVoucherForm}
        vendorInvoiceNo={vendorInvoiceNo}
        isAllowVoucherNumberEdit={isAllowVoucherNumberEdit}
      />
    </Layer>
  );
};

VoucherEditLayer.manifest = Object.freeze({
  voucher: VOUCHER_BY_ID,
  invoice: invoiceResource,
  configVoucherNumber,
  query: {},
});

VoucherEditLayer.propTypes = {
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(VoucherEditLayer);
