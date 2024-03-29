import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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

  it('should call link prop when link icon is pressed', async () => {
    const link = jest.fn();

    renderInvoiceLineOrderLineNumber({ ...defaultProps, link });

    await user.click(screen.getByText('Icon'));

    expect(link).toHaveBeenCalled();
  });

  it('should not display clip copy icon', () => {
    renderInvoiceLineOrderLineNumber();

    expect(screen.queryByTestId('clip-copy-icon')).toBeNull();
  });

  it('should display clip copy icon', () => {
    renderInvoiceLineOrderLineNumber({ ...defaultProps, poLineNumber: '1001-1' });

    expect(screen.getByTestId('clip-copy-icon')).toBeDefined();
  });
});
