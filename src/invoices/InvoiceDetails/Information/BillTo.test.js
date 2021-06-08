import React from 'react';
import { render } from '@testing-library/react';

import BillTo from './BillTo';

const testId = 'testId';
const testAddress = { address: 'testAddress' };
const testResources = {
  billToAddress: {
    records: [{ id: testId, value: JSON.stringify(testAddress) }],
  },
};

const renderBillTo = ({
  resources,
  billToId,
}) => (render(
  <BillTo
    resources={resources}
    billToId={billToId}
  />,
));

describe('BillTo component', () => {
  it('should display address', () => {
    const { getByText } = renderBillTo({ resources: testResources, billToId: testId });

    expect(getByText(testAddress.address)).toBeDefined();
  });

  it('should display hyphen instead of address', () => {
    const { getByText } = renderBillTo({ resources: {} });

    expect(getByText('-')).toBeDefined();
  });
});
