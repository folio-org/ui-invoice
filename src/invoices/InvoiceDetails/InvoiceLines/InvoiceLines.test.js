import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import {
  invoice,
  invoiceLine,
} from 'fixtures';
import { INVOICE_LINES_COLUMN_MAPPING } from '../../constants';
import InvoiceLines from './InvoiceLines';

jest.mock('./InvoiceLineOrderLineNumber', () => ({
  InvoiceLineOrderLineNumber: jest.fn(() => 'InvoiceLineOrderLineNumber'),
}));
jest.mock('./InvoiceLineOrderLineLink', () => ({
  InvoiceLineOrderLineLink: jest.fn(() => 'InvoiceLineOrderLineLink'),
}));

const defaultProps = {
  exchangedTotalsMap: new Map([[invoiceLine.id, { calculation: 100 }]]),
  invoice,
  invoiceLinesItems: [invoiceLine],
  openLineDetails: jest.fn(),
  orderlinesMap: {},
  refreshData: jest.fn(),
  vendor: {},
  visibleColumns: Object.keys(INVOICE_LINES_COLUMN_MAPPING),
};
const renderInvoiceLines = (props = {}) => render(
  <InvoiceLines
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLines', () => {
  it('should render correct structure', async () => {
    const { asFragment } = renderInvoiceLines();

    expect(asFragment()).toMatchSnapshot();
  });
});
