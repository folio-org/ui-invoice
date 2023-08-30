import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { history, location, match } from '../../../test/jest/fixtures';
import { InvoiceLineFormContainer } from '../InvoiceLineForm';

import { EditInvoiceLine } from './EditInvoiceLine';

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
const renderEditInvoiceLine = (props = defaultProps) => render(
  <EditInvoiceLine
    {...props}
  />,
);

describe('EditInvoiceLine', () => {
  beforeEach(() => {
    InvoiceLineFormContainer.mockClear();

    historyMock.push.mockClear();
  });

  it('should display invoice line form', () => {
    renderEditInvoiceLine();

    expect(screen.getByText('InvoiceLineFormContainer')).toBeDefined();
  });

  it('should redirect to invoice details when create is done/cancelled', () => {
    renderEditInvoiceLine();

    InvoiceLineFormContainer.mock.calls[0][0].onClose();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`/invoice/view/${match.params.id}`);
  });
});
