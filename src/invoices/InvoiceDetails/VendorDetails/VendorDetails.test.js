import React from 'react';
import { render } from '@testing-library/react';

import { invoice } from '../../../../test/jest/fixtures';

import VendorDetails from './VendorDetails';

jest.mock('@folio/stripes-acq-components', () => ({
  OrganizationValue: jest.fn(({ id }) => id),
}));

const { accountingCode, vendorId, vendorInvoiceNo } = invoice;
const defaultProps = {
  accountingCode,
  vendorId,
  vendorInvoiceNo,
};
const renderVendorDetails = (props = defaultProps) => render(
  <VendorDetails {...props} />,
);

describe('VendorDetails', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure for invoice vendor details', () => {
    const { asFragment } = renderVendorDetails();

    expect(asFragment()).toMatchSnapshot();
  });
});
