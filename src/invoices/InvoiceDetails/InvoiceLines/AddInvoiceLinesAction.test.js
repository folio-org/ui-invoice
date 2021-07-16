import React from 'react';
import { render, screen } from '@testing-library/react';

import AddInvoiceLinesAction from './AddInvoiceLinesAction';

const defaultProps = {
  isDisabled: false,
  addLines: jest.fn(),
  validateSelectedRecords: jest.fn(),
};
const renderAddInvoiceLinesAction = (props = defaultProps) => render(
  <AddInvoiceLinesAction {...props} />,
);

describe('AddInvoiceLinesAction', () => {
  it('should display find po plugin (unavailable mode)', () => {
    renderAddInvoiceLinesAction();

    expect(screen.getByText('ui-invoice.find-po-line-plugin-unavailable')).toBeDefined();
  });
});
