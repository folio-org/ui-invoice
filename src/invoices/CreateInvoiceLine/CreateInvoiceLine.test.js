import React from 'react';
import { render, screen } from '@testing-library/react';

import { history, location, match } from '../../../test/jest/fixtures';
import { InvoiceLineFormContainer } from '../InvoiceLineForm';

import { CreateInvoiceLine } from './CreateInvoiceLine';

jest.mock('../InvoiceLineForm', () => ({
  InvoiceLineFormContainer: jest.fn().mockReturnValue('InvoiceLineFormContainer'),
}));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const defaultProps = {
  location,
  history: historyMock,
  match,
};
const renderCreateInvoiceLine = (props = defaultProps) => render(
  <CreateInvoiceLine
    {...props}
  />,
);

describe('CreateInvoiceLine', () => {
  beforeEach(() => {
    InvoiceLineFormContainer.mockClear();

    historyMock.push.mockClear();
  });

  it('should display invoice line form', () => {
    renderCreateInvoiceLine();

    expect(screen.getByText('InvoiceLineFormContainer')).toBeDefined();
  });

  it('should redirect to invoice details when create is done/cancelled', () => {
    renderCreateInvoiceLine();

    InvoiceLineFormContainer.mock.calls[0][0].onClose();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`/invoice/view/${match.params.id}`);
  });
});
