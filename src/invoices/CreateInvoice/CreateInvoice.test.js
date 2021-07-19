import React from 'react';
import { render, screen } from '@testing-library/react';

import { history, location } from '../../../test/jest/fixtures';
import { InvoiceFormContainer } from '../InvoiceForm';

import { CreateInvoice } from './CreateInvoice';

jest.mock('../InvoiceForm', () => ({
  InvoiceFormContainer: jest.fn().mockReturnValue('InvoiceFormContainer'),
}));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const defaultProps = {
  location,
  history: historyMock,
};
const renderCreateInvoice = (props = defaultProps) => render(
  <CreateInvoice
    {...props}
  />,
);

describe('CreateInvoice', () => {
  beforeEach(() => {
    InvoiceFormContainer.mockClear();

    historyMock.push.mockClear();
  });

  it('should display invoice form', () => {
    renderCreateInvoice();

    expect(screen.getByText('InvoiceFormContainer')).toBeDefined();
  });

  it('should redirect to invoice list when create is cancelled', () => {
    renderCreateInvoice();

    InvoiceFormContainer.mock.calls[0][0].onCancel();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe('/invoice');
  });

  it('should redirect to invoice details when create is done', () => {
    renderCreateInvoice();

    InvoiceFormContainer.mock.calls[0][0].onCancel('invoiceId');

    expect(historyMock.push.mock.calls[0][0].pathname).toBe('/invoice/view/invoiceId');
  });
});
