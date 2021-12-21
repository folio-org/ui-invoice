import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';

import { invoiceLine } from '../../../../test/jest/fixtures';

import { OtherRelatedInvoiceLines } from './OtherRelatedInvoiceLines';

const defaultProps = {
  invoiceLines: [invoiceLine],
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <IntlProvider locale="en">
      {children}
    </IntlProvider>
  </MemoryRouter>
);

const renderOtherRelatedInvoiceLines = (props = {}) => render(
  <OtherRelatedInvoiceLines
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('OtherRelatedInvoiceLines', () => {
  it('should render RelatedInvoiceLines multicolumn list', () => {
    renderOtherRelatedInvoiceLines();

    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.invoiceLine')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.invoiceDate')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.vendorInvoiceNo')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.vendorName')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.status')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.quantity')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.amount')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.otherRelatedInvoiceLines.comment')).toBeInTheDocument();
  });
});
