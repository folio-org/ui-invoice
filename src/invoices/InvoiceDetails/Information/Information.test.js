import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import Information from './Information';

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useFiscalYear: jest.fn(() => ({ fiscalYear: { code: 'FY2023' } })),
}));
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
  <IntlProvider locale="en">
    <Information
      batchGroupId={batchGroupId}
      invoiceDate={invoiceDate}
      status={status}
      source={source}
      currency={currency}
      lockTotal={lockTotal}
    />
  </IntlProvider>,
));

describe('Information component', () => {
  it('should display invoice information', () => {
    const { getByText } = renderInformation(invoiceInformation);

    expect(getByText('stripes-acq-components.sources.user')).toBeDefined();
    expect(getByText('ui-invoice.invoice.status.open')).toBeDefined();
    expect(getByText('2020-12-09')).toBeDefined();
    expect(getByText('FY2023')).toBeInTheDocument();
  });

  it('should not display lock total amount', () => {
    const { queryByTestId } = renderInformation(invoiceInformation);

    expect(queryByTestId('lock-total-amount')).toEqual(null);
  });

  it('should display lock total amount', () => {
    const { getByText } = renderInformation({ ...invoiceInformation, lockTotal: 10 });

    expect(getByText('$10.00')).toBeDefined();
    expect(getByText('ui-invoice.invoice.lockTotalAmount')).toBeDefined();
  });
});
