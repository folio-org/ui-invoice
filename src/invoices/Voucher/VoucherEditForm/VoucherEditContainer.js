import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
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
  history,
  location,
}) => {
  const [voucher, setVoucher] = useState();
  const [vendorInvoiceNo, setVoucherInvoiceNo] = useState();
  const [isAllowVoucherNumberEdit, setAllowVoucherNumberEdit] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    const voucherPromise = mutator.voucher.GET();
    const invoicePromise = mutator.invoice.GET();
    const configVoucherPromise = mutator.configVoucherNumber.GET();

    Promise.all([invoicePromise, configVoucherPromise, voucherPromise])
      .then(([invoiceResponse, configVoucherResponse, voucherResponse]) => {
        const { allowVoucherNumberEdit } = getConfigSetting(configVoucherResponse);

        setVoucherInvoiceNo(invoiceResponse.vendorInvoiceNo);
        setAllowVoucherNumberEdit(allowVoucherNumberEdit);
        setVoucher(voucherResponse);
      })
      .catch(() => {
        showCallout({ messageId: 'ui-invoice.errors.voucherLoadingFailed', type: 'error' });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeVoucherForm = useCallback(
    () => {
      const _path = `/invoice/view/${params.id}/voucher/${params.voucherId}/view`;

      history.push({
        pathname: _path,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.id, location.search],
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
    [closeVoucherForm, showCallout],
  );

  if (!(voucher && vendorInvoiceNo)) {
    return (
      <LoadingView onClose={closeVoucherForm} />
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
  invoice: {
    ...invoiceResource,
    accumulate: true,
  },
  configVoucherNumber: {
    ...configVoucherNumber,
    accumulate: true,
  },
});

VoucherEditContainer.propTypes = {
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
};

export default stripesConnect(VoucherEditContainer);
