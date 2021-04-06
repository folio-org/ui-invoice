import React from 'react';
import { render } from '@testing-library/react';

import VendorAddress from './VendorAddress';

jest.mock('./useVendor', () => ({
  useVendor: jest.fn().mockReturnValue({ vendor: { name: 'TestVendor' } }),
}));

const vendorAddress = {
  addressLine1: 'test address 1',
  addressLine2: 'test address 2',
  city: 'New York',
  stateRegion: 'NY',
  zipCode: '00001',
  country: 'USA',
};

const renderVendorAddress = (
  address,
  vendorId = 'vendorId',
) => (render(
  <VendorAddress
    address={address}
    vendorId={vendorId}
  />,
));

describe('VendorAddress component', () => {
  it('should display vendor address', () => {
    const { getByText } = renderVendorAddress(vendorAddress);

    expect(getByText(vendorAddress.addressLine1)).toBeDefined();
    expect(getByText(vendorAddress.addressLine2)).toBeDefined();
    expect(getByText(vendorAddress.city)).toBeDefined();
    expect(getByText(vendorAddress.stateRegion)).toBeDefined();
    expect(getByText(vendorAddress.zipCode)).toBeDefined();
    expect(getByText('TestVendor')).toBeDefined();
    expect(getByText('stripes-components.countries.US')).toBeDefined();
  });
});
