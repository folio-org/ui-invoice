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

import css from './ApproveInvoiceAction.css';

const ApproveInvoiceAction = ({ saveInvoice, invoice }) => {
  const [isApproveConfirmationOpen, toggleApproveConfirmation] = useModalToggle();
  const showCallout = useShowToast();

  const approveInvoice = useCallback(
    () => {
      const approvedInvoice = { ...invoice, status: INVOICE_STATUS.approved };

      saveInvoice(approvedInvoice)
        .then(() => showCallout('ui-invoice.invoice.actions.approve.success'))
        .catch(async (response) => {
          try {
            const { errors } = await response.json();
            const errorCode = get(errors, [0, 'code']);

            showCallout(`ui-invoice.invoice.actions.approve.error.${errorCode}`, 'error');
          } catch (e) {
            showCallout('ui-invoice.invoice.actions.approve.error', 'error');
          }
        });
      toggleApproveConfirmation();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveInvoice, invoice, toggleApproveConfirmation],
  );

  return (
    <div className={css.approveInvoiceActionWrapper}>
      <Button
        data-test-invoice-action-approve
        buttonStyle="default"
        onClick={toggleApproveConfirmation}
      >
        <FormattedMessage id="ui-invoice.invoice.actions.approve" />
      </Button>
      {
        isApproveConfirmationOpen && (
          <ConfirmationModal
            id="approve-invoice-confirmation"
            heading={<FormattedMessage id="ui-invoice.invoice.actions.approve.confirmation.heading" />}
            message={<FormattedMessage id="ui-invoice.invoice.actions.approve.confirmation.message" />}
            onCancel={toggleApproveConfirmation}
            onConfirm={approveInvoice}
            open
          />
        )
      }
    </div>
  );
};

ApproveInvoiceAction.propTypes = {
  saveInvoice: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default ApproveInvoiceAction;
