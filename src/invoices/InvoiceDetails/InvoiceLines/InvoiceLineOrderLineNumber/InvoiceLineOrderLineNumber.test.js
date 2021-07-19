import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { invoiceLine } from '../../../../../test/jest/fixtures';
import { INVOICE_STATUS } from '../../../../common/constants';

import { InvoiceLineOrderLineNumber } from './InvoiceLineOrderLineNumber';

const defaultProps = {
  invoiceLine,
  poLineNumber: undefined,
  link: jest.fn(),
};
const renderInvoiceLineOrderLineNumber = (props = defaultProps) => render(
  <InvoiceLineOrderLineNumber {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLineOrderLineNumber', () => {
  it('should display order line number when defined', () => {
    const orderLineNumber = '1000-7';

    renderInvoiceLineOrderLineNumber({ ...defaultProps, poLineNumber: orderLineNumber });

    expect(screen.getByText(orderLineNumber)).toBeDefined();
  });

  it('should display link icon when status is not post approval', () => {
    renderInvoiceLineOrderLineNumber({
      ...defaultProps,
      invoiceLine: {
        ...invoiceLine,
        invoiceLineStatus: INVOICE_STATUS.open,
      },
    });

    expect(screen.getByText('Icon')).toBeDefined();
  });

  it('should not display link icon when status is post approval', () => {
    renderInvoiceLineOrderLineNumber({
      ...defaultProps,
      invoiceLine: {
        ...invoiceLine,
        invoiceLineStatus: INVOICE_STATUS.approved,
      },
    });

    expect(screen.queryByText('Icon')).toBeNull();
  });

  it('should call link prop when link icon is pressed', () => {
    const link = jest.fn();

    renderInvoiceLineOrderLineNumber({ ...defaultProps, link });

    user.click(screen.getByText('Icon'));

    expect(link).toHaveBeenCalled();
  });
});
