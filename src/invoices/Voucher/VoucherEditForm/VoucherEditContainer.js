import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import {
  Paneset,
  LoadingView,
} from '@folio/stripes/components';
import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  getConfigSetting,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  invoiceResource,
  VOUCHER_BY_ID,
  configVoucherNumber,
} from '../../../common/resources';
import VoucherEditForm from './VoucherEditForm';

const VoucherEditContainer = ({
  match: { params },
  mutator,
  resources,
  history,
  location,
}) => {
  const [voucher, setVoucher] = useState();
  const [vendorInvoiceNo, setVoucherInvoiceNo] = useState();
  const [isAllowVoucherNumberEdit, setAllowVoucherNumberEdit] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    mutator.voucher.GET({
      params: {
        id: params.voucherId,
      },
    })
      .then(setVoucher)
      .catch(() => {
        showCallout({ messageId: 'ui-invoice.errors.voucherLoadingFailed', type: 'error' });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const invoiceNo = get(resources, ['invoice', 'records', 0, 'vendorInvoiceNo']);
    const { allowVoucherNumberEdit } = getConfigSetting(get(resources, 'configVoucherNumber.records', {}));

    setAllowVoucherNumberEdit(allowVoucherNumberEdit);
    setVoucherInvoiceNo(invoiceNo);
  }, [resources]);

  const closeVoucherForm = useCallback(
    () => {
      const _path = `/invoice/view/${params.id}/voucher/${params.voucherId}/view`;

      history.push({
        pathname: _path,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id],
  );

  const saveVoucher = useCallback(
    (vouch) => {
      mutator.voucher.PUT(vouch)
        .then(() => {
          showCallout({ messageId: 'ui-invoice.invoice.details.voucher.save.success' });
          closeVoucherForm();
        })
        .catch(() => {
          showCallout({ messageId: 'ui-invoice.errors.voucherHasNotBeenSaved', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeVoucherForm],
  );

  if (!(voucher && vendorInvoiceNo)) {
    return (
      <Paneset>
        <LoadingView onClose={closeVoucherForm} />
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
});

VoucherEditContainer.propTypes = {
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
};

export default stripesConnect(VoucherEditContainer);
