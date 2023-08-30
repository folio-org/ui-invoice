import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { history, location, match } from '../../../test/jest/fixtures';
import { InvoiceFormContainer } from '../InvoiceForm';

import { EditInvoice } from './EditInvoice';

jest.mock('../InvoiceForm', () => ({
  InvoiceFormContainer: jest.fn().mockReturnValue('InvoiceFormContainer'),
}));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const defaultProps = {
  location,
  match,
  history: historyMock,
};
const renderEditInvoice = (props = defaultProps) => render(
  <EditInvoice
    {...props}
  />,
);

describe('EditInvoice', () => {
  beforeEach(() => {
    InvoiceFormContainer.mockClear();

    historyMock.push.mockClear();
  });

  it('should display invoice form', () => {
    renderEditInvoice();

    expect(screen.getByText('InvoiceFormContainer')).toBeDefined();
  });

  it('should redirect to invoice details when edit is done', () => {
    renderEditInvoice();

    InvoiceFormContainer.mock.calls[0][0].onCancel();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`/invoice/view/${match.params.id}`);
  });
});
