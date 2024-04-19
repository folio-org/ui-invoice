import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import AddInvoiceLinesAction from './AddInvoiceLinesAction';

const defaultProps = {
  onClose: jest.fn(),
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
