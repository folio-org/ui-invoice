import { render } from '@folio/jest-config-stripes/testing-library/react';

import ExtendedInformation from './ExtendedInformation';

jest.mock('@folio/stripes-acq-components/lib/ExchangeRateValue/ExchangeRateValue', () => {
  return () => <span>ExchangeRateValue</span>;
});

const extendedInformation = {
  folioInvoiceNo: '0001',
  paymentMethod: 'Cash',
  currency: 'USD',
};

const renderExtendedInformation = ({
  folioInvoiceNo,
  paymentMethod,
  currency,
  exchangeRate,
}) => (render(
  <ExtendedInformation
    folioInvoiceNo={folioInvoiceNo}
    paymentMethod={paymentMethod}
    currency={currency}
    exchangeRate={exchangeRate}
  />,
));

describe('ExtendedInformation component', () => {
  it('should display extended information', () => {
    const { getByText } = renderExtendedInformation(extendedInformation);

    expect(getByText(extendedInformation.folioInvoiceNo)).toBeDefined();
    expect(getByText(extendedInformation.currency)).toBeDefined();
    expect(getByText('stripes-acq-components.paymentMethod.cash')).toBeDefined();
  });

  it('should not display exchange rate', () => {
    const { queryByTestId } = renderExtendedInformation(extendedInformation);

    expect(queryByTestId('exchange-rate-value')).toEqual(null);
  });

  it('should display exchange rate', () => {
    const { getByTestId } = renderExtendedInformation({ ...extendedInformation, currency: 'EUR' });

    expect(getByTestId('exchange-rate-value')).toBeDefined();
  });
});
