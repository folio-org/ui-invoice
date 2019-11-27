import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

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

import css from './PayInvoiceAction.css';

const PayInvoiceAction = ({ saveInvoice, invoice }) => {
  const [isPayConfirmationOpen, togglePayConfirmation] = useModalToggle();
  const showCallout = useShowToast();

  const payInvoice = useCallback(
    () => {
      const paidInvoice = { ...invoice, status: INVOICE_STATUS.paid };

      saveInvoice(paidInvoice)
        .then(() => showCallout('ui-invoice.invoice.actions.pay.success'))
        .catch(async (response) => {
          try {
            const { errors } = await response.json();
            const errorCode = get(errors, [0, 'code']);

            showCallout(
              getApproveErrorMessage(errorCode, 'ui-invoice.invoice.actions.pay.error'),
              'error',
            );
          } catch (e) {
            showCallout('ui-invoice.invoice.actions.pay.error', 'error');
          }
        });

      togglePayConfirmation();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveInvoice, invoice, togglePayConfirmation],
  );

  return (
    <div className={css.payInvoiceActionWrapper}>
      <Button
        data-test-invoice-action-pay
        buttonStyle="primary"
        onClick={togglePayConfirmation}
      >
        <FormattedMessage id="ui-invoice.invoice.actions.pay" />
      </Button>
      {
        isPayConfirmationOpen && (
          <ConfirmationModal
            id="pay-invoice-confirmation"
            heading={<FormattedMessage id="ui-invoice.invoice.actions.pay.confirmation.heading" />}
            message={<FormattedMessage id="ui-invoice.invoice.actions.pay.confirmation.message" />}
            onCancel={togglePayConfirmation}
            onConfirm={payInvoice}
            open
          />
        )
      }
    </div>
  );
};

PayInvoiceAction.propTypes = {
  saveInvoice: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
};

export default PayInvoiceAction;
