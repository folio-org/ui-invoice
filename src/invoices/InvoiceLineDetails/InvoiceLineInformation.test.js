import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';

import { orderLine, invoiceLine } from '../../../test/jest/fixtures';

import InvoiceLineInformation from './InvoiceLineInformation';

const defaultProps = {
  invoiceLine,
  currency: 'USD',
  poLine: orderLine,
};
const renderInvoiceLineInformation = (props = defaultProps) => (render(
  <InvoiceLineInformation {...props} />,
  { wrapper: MemoryRouter },
));

describe('InvoiceLineInformation', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should display info invoice line connected to order line', () => {
    const { asFragment } = renderInvoiceLineInformation();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display info invoice line not connected to order line', () => {
    const { asFragment } = renderInvoiceLineInformation({
      ...defaultProps,
      poLine: {},
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
