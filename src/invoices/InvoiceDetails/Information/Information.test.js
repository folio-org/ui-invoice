import React from 'react';
import { render } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import Information from './Information';

jest.mock('../../../common/components/Status/StatusValue', () => {
  return () => <span>StatusValue</span>;
});

jest.mock('../BatchGroupValue', () => {
  return () => <span>BatchGroupValue</span>;
});

const invoiceInformation = {
  batchGroupId: 'cd592659-77aa-4eb3-ac34-c9a4657bb20f',
  invoiceDate: '2020-12-09T00:00:00.000+0000',
  status: 'Open',
  source: 'User',
  currency: 'USD',
};

const renderInformation = ({
  batchGroupId,
  invoiceDate,
  status,
  source,
  currency,
  lockTotal,
}) => (render(
  <Information
    batchGroupId={batchGroupId}
    invoiceDate={invoiceDate}
    status={status}
    source={source}
    currency={currency}
    lockTotal={lockTotal}
  />,
));

describe('Information component', () => {
  it('should display invoice information labels', () => {
    const { getByText } = renderInformation(invoiceInformation);

    expect(getByText('ui-invoice.invoice.details.information.invoiceDate')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.paymentDue')).toBeDefined();
    expect(getByText('ui-invoice.invoice.paymentTerms')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.approvedDate')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.source')).toBeDefined();
    expect(getByText('ui-invoice.invoice.note')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.totalUnits')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.subTotal')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.adjustment')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.calculatedTotalAmount')).toBeDefined();
    expect(getByText('ui-invoice.invoice.details.information.subTotal')).toBeDefined();
  });

  it('should not display lock total amount', () => {
    const { queryByTestId } = renderInformation(invoiceInformation);

    expect(queryByTestId('loca-total-amount')).toEqual(null);
  });

  it('should display lock total amount', () => {
    const { queryByTestId, getByText } = renderInformation({ ...invoiceInformation, lockTotal: 10 });

    expect(queryByTestId('lock-total-amount')).not.toEqual(null);
    expect(getByText('ui-invoice.invoice.lockTotalAmount')).toBeDefined();
  });
});
