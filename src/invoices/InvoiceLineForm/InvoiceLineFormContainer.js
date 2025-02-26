import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingView } from '@folio/stripes/components';
import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  baseManifest,
  useOrganization,
} from '@folio/stripes-acq-components';

import {
  SUBMIT_ACTION,
  SUBMIT_ACTION_FIELD_NAME,
} from '../../common/constants';
import {
  useInvoice,
  useInvoiceLine,
} from '../../common/hooks';
import {
  CONFIG_ADJUSTMENTS,
  invoiceLineResource,
} from '../../common/resources';
import { getSettingsAdjustmentsList } from '../../settings/adjustments/util';
import { showUpdateInvoiceError } from '../InvoiceDetails/utils';
import InvoiceLineForm from './InvoiceLineForm';

export function InvoiceLineFormContainerComponent({
  history,
  location,
  match: { params: { id, lineId } },
  onClose,
  mutator,
  resources,
  showCallout,
}) {
  const ky = useOkapiKy();

  const {
    invoice,
    isLoading: isInvoiceLoading,
  } = useInvoice(id, {
    onError: () => {
      showCallout({
        messageId: 'ui-invoice.errors.cantLoadInvoice',
        type: 'error',
      });
    },
  });

  const {
    invoiceLine,
    isLoading: isInvoiceLineLoading,
    isFetching: isInvoiceLineFetching,
    refetch: refetchInvoiceLine,
  } = useInvoiceLine(lineId, {
    onError: () => {
      showCallout({
        messageId: 'ui-invoice.errors.cantLoadInvoiceLine',
        type: 'error',
      });
    },
  });

  const {
    organization: vendor,
    isLoading: isVendorLoading,
  } = useOrganization(invoice?.vendorId, {
    onError: () => {
      showCallout({
        messageId: 'ui-invoice.errors.cantLoadVendor',
        type: 'error',
      });
    },
  });

  const saveInvoiceLine = useCallback((
    {
      [SUBMIT_ACTION_FIELD_NAME]: submitAction,
      ...values
    },
    form,
  ) => {
    const mutatorMethod = values.id ? 'PUT' : 'POST';

    return mutator.invoiceLine[mutatorMethod](values)
      .then((result) => {
        showCallout({ messageId: 'ui-invoice.invoiceLine.hasBeenSaved' });

        return result;
      })
      .then(async (result) => {
        switch (submitAction) {
          case SUBMIT_ACTION.saveAndKeepEditing: {
            if (!lineId) {
              history.push({
                pathname: `/invoice/view/${id}/line/${result.id}/edit`,
                search: location.search,
              });
            }

            await refetchInvoiceLine();
            form.restart();
            break;
          }
          case SUBMIT_ACTION.saveAndClose:
          default:
            onClose();
        }
      })
      .catch((response) => {
        showUpdateInvoiceError({
          response,
          showCallout,
          action: 'saveLine',
          defaultErrorMessageId: 'ui-invoice.errors.invoiceLineHasNotBeenSaved',
          expenseClassMutator: mutator.expenseClass,
          fundMutator: mutator.fund,
          ky,
        });

        return { id: 'Unable to save invoice line' };
      });
  }, [
    history,
    id,
    ky,
    lineId,
    location.search,
    mutator.expenseClass,
    mutator.fund,
    mutator.invoiceLine,
    onClose,
    refetchInvoiceLine,
    showCallout,
  ]);

  const isLoading = (
    isInvoiceLineLoading
    || isInvoiceLoading
    || isVendorLoading
  );

  const vendorCode = get(vendor, 'erpCode', '');
  const accounts = get(vendor, 'accounts', []);
  const adjustmentsPresets = getSettingsAdjustmentsList(get(resources, ['configAdjustments', 'records'], []));

  const initialValues = useMemo(() => {
    return lineId
      ? invoiceLine
      : {
        invoiceId: id,
        invoiceLineStatus: invoice?.status,
        fundDistributions: [],
        releaseEncumbrance: false,
      };
  }, [id, lineId, invoice, invoiceLine]);

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <InvoiceLineForm
      accounts={accounts}
      adjustmentsPresets={adjustmentsPresets}
      initialValues={initialValues}
      invoice={invoice}
      isSubmitDisabled={isInvoiceLineFetching}
      onCancel={onClose}
      onSubmit={saveInvoiceLine}
      vendorCode={vendorCode}
    />
  );
}

InvoiceLineFormContainerComponent.manifest = Object.freeze({
  invoiceLine: {
    ...invoiceLineResource,
    accumulate: true,
    fetch: false,
  },
  configAdjustments: CONFIG_ADJUSTMENTS,
  expenseClass: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  fund: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
});

InvoiceLineFormContainerComponent.propTypes = {
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  showCallout: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(InvoiceLineFormContainerComponent));
