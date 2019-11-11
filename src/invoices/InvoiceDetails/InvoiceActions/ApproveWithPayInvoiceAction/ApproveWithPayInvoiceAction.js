import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  useShowToast,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { INVOICE_STATUS } from '../../../../common/constants';
import { getApproveErrorMessage } from '../../../../common/utils/getApproveErrorMessage';

import css from './ApproveWithPayInvoiceAction.css';

const ApproveWithPayInvoiceAction = ({ saveInvoice, invoice }) => {
  const [isApproveConfirmationOpen, toggleApproveConfirmation] = useModalToggle();
  const showCallout = useShowToast();

  const approveInvoice = useCallback(
    () => {
      saveInvoice({ ...invoice, status: INVOICE_STATUS.approved })
        .then(savedInvoice => saveInvoice({ ...savedInvoice, status: INVOICE_STATUS.paid }))
        .then(() => showCallout('ui-invoice.invoice.actions.approveAndPay.success'))
        .catch(async (response) => {
          try {
            const { errors } = await response.json();
            const errorCode = get(errors, [0, 'code']);

            showCallout(
              getApproveErrorMessage(errorCode, 'ui-invoice.invoice.actions.approveAndPay.error'),
              'error',
            );
          } catch (e) {
            showCallout('ui-invoice.invoice.actions.approveAndPay.error', 'error');
          }
        });
      toggleApproveConfirmation();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveInvoice, invoice, toggleApproveConfirmation],
  );

  return (
    <div className={css.approveWithPayInvoiceAction}>
      <Button
        data-test-invoice-action-approve
        buttonStyle="default"
        onClick={toggleApproveConfirmation}
      >
        <FormattedMessage id="ui-invoice.invoice.actions.approveAndPay" />
      </Button>
      {
        isApproveConfirmationOpen && (
          <ConfirmationModal
            id="approve-pay-invoice-confirmation"
            heading={<FormattedMessage id="ui-invoice.invoice.actions.approveAndPay.confirmation.heading" />}
            message={<FormattedMessage id="ui-invoice.invoice.actions.approveAndPay.confirmation.message" />}
            onCancel={toggleApproveConfirmation}
            onConfirm={approveInvoice}
            open
          />
        )
      }
    </div>
  );
};

ApproveWithPayInvoiceAction.propTypes = {
  saveInvoice: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default ApproveWithPayInvoiceAction;
