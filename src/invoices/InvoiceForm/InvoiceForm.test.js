import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { act, render, fireEvent } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import InvoiceForm from './InvoiceForm';

jest.mock('../AdjustmentsForm', () => {
  return () => <span>AdjustmentsForm</span>;
});

jest.mock('@folio/stripes-acq-components/lib/CurrencyExchangeRateFields/CurrencyExchangeRateFields', () => {
  return () => <span>CurrencyExchangeRateFields</span>;
});

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});

const renderInvoiceForm = (
  initialValues = {},
  batchGroups = [],
  parentResources = {},
) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn}
      render={() => (
        <InvoiceForm
          batchGroups={batchGroups}
          form={{}}
          onSubmit={jest.fn}
          onCancel={jest.fn}
          initialValues={initialValues}
          pristine={false}
          submitting={false}
          parentResources={parentResources}
        />
      )}
    />
  </MemoryRouter>,
));

describe('InvoiceForm component', () => {
  it('should display title', () => {
    const { getByText } = renderInvoiceForm();

    expect(getByText('ui-invoice.invoice.paneTitle.create')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderInvoiceForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('ui-invoice.saveAndClose')).toBeDefined();
  });

  it('should uncheck lock-total initially', () => {
    const { getByTestId } = renderInvoiceForm();

    expect(getByTestId('lock-total').checked).toEqual(false);
  });

  describe('When lock total is unchecked', () => {
    it('then lock total amount is readonly', () => {
      const { getByTestId } = renderInvoiceForm();

      expect(getByTestId('lock-total-amount')).toHaveAttribute('readonly');
    });
  });

  describe('When lock total is checked', () => {
    it('then lock total amount field should become editable', async () => {
      let getByTestId;

      await act(async () => {
        const renderer = await renderInvoiceForm();

        getByTestId = renderer.getByTestId;
      });

      const lockTotal = getByTestId('lock-total');

      fireEvent(lockTotal, new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(getByTestId('lock-total-amount')).not.toHaveAttribute('readonly');
    });
  });
});
