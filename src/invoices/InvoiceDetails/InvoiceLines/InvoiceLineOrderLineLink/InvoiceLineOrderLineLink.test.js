import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { invoice, invoiceLine } from '../../../../../test/jest/fixtures';

import { InvoiceLineOrderLineLink } from './InvoiceLineOrderLineLink';

jest.mock('../../../../common/hooks', () => ({
  useInvoiceLineMutation: jest.fn().mockReturnValue({ mutateInvoiceLine: jest.fn() }),
}));

const defaultProps = {
  invoice,
  invoiceLine,
  vendor: {},
  refreshData: jest.fn(),
};
const renderInvoiceLineOrderLineLink = (props = defaultProps) => render(
  <InvoiceLineOrderLineLink {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLineOrderLineLink', () => {
  it('should display find po plugin (unavailable mode)', () => {
    renderInvoiceLineOrderLineLink();

    expect(screen.getByText('ui-invoice.find-po-line-plugin-unavailable')).toBeDefined();
  });
});
