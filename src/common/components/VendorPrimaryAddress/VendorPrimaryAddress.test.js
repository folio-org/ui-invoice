import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import { VendorPrimaryAddress } from './VendorPrimaryAddress';

jest.mock('../../hooks/useAddressCategories', () => ({
  useAddressCategories: jest.fn().mockReturnValue({ isLoading: false, categoriesMap: {} }),
}));

const defaultVendor = {
  addresses: [{
    country: 'USA',
    language: 'eng',
    city: 'Alexandria',
    zipCode: '22314',
    isPrimary: true,
  }],
};

const renderDuplicateInvoiceList = (vendor) => (render(
  <MemoryRouter>
    <VendorPrimaryAddress
      vendor={vendor}
    />
  </MemoryRouter>,
));

describe('VendorPrimaryAddress component', () => {
  it('should display address', () => {
    const { getByText } = renderDuplicateInvoiceList(defaultVendor);

    expect(getByText('ui-invoice.invoice.details.address')).toBeDefined();
    expect(getByText('stripes-smart-components.address.primary')).toBeDefined();
    expect(getByText(defaultVendor.addresses[0].city)).toBeDefined();
    expect(getByText(defaultVendor.addresses[0].zipCode)).toBeDefined();
    expect(getByText('stripes-components.languages.eng')).toBeDefined();
    expect(getByText('stripes-components.countries.US')).toBeDefined();
  });

  it('should not display address', () => {
    const { queryByText } = renderDuplicateInvoiceList();

    expect(queryByText('ui-invoice.invoice.details.address')).toBeNull();
  });
});
