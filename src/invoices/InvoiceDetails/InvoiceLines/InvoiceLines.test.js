import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { invoice, invoiceLine } from '../../../../test/jest/fixtures';

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
  visibleColumns: [
    'lineNumber',
    'polNumber',
    'description',
    'fundCode',
    'quantity',
    'subTotal',
    'adjustmentsTotal',
    'total',
    'vendorCode',
    'vendorRefNo',
  ],
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
