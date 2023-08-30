import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import { invoice, invoiceLine } from '../../../../test/jest/fixtures';

import { INVOICE_LINES_COLUMN_MAPPING } from '../../constants';
import InvoiceLines from './InvoiceLines';

jest.mock('./InvoiceLineOrderLineNumber', () => ({
  InvoiceLineOrderLineNumber: jest.fn(() => 'InvoiceLineOrderLineNumber'),
}));
jest.mock('./InvoiceLineOrderLineLink', () => ({
  InvoiceLineOrderLineLink: jest.fn(() => 'InvoiceLineOrderLineLink'),
}));

const defaultProps = {
  invoice,
  invoiceLinesItems: [invoiceLine],
  orderlinesMap: {},
  vendor: {},
  visibleColumns: Object.keys(INVOICE_LINES_COLUMN_MAPPING),
  openLineDetails: jest.fn(),
  refreshData: jest.fn(),
};
const renderInvoiceLines = (props = defaultProps) => render(
  <InvoiceLines {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLines', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { asFragment } = renderInvoiceLines();

    expect(asFragment()).toMatchSnapshot();
  });
});
