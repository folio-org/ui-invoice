import { act, render } from '@folio/jest-config-stripes/testing-library/react';

import ApproveConfirmationModal from './ApproveConfirmationModal';

const INVOICE = {
  currency: 'USD',
  folioInvoiceNo: '10000',
  id: 'fba9f008-29e3-42be-b589-2cc7daf9486c',
  invoiceDate: '2020-12-17T00:00:00.000+0000',
  status: 'Approved',
  total: 1,
  vendorId: '11fb627a-cdf1-11e8-a8d5-f2801f1b9fd1',
};

const renderApproveConfirmationModal = (
  invoice,
  mutator,
  onCancel = () => jest.fn(),
  onConfirm = () => jest.fn(),
) => (render(
  <ApproveConfirmationModal
    onCancel={onCancel}
    onConfirm={onConfirm}
    invoice={invoice}
    mutator={mutator}
  />,
));

describe('ApproveConfirmationModal component', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      duplicateInvoices: { GET: jest.fn(() => Promise.resolve([])) },
      vendors: { GET: jest.fn(() => Promise.resolve([])) },
    };
  });

  it('should display modal title, message, footer', async () => {
    let getByText;

    await act(async () => {
      const renderer = await renderApproveConfirmationModal(INVOICE, mutator);

      getByText = renderer.getByText;
    });

    expect(getByText('ui-invoice.invoice.actions.approve.confirmation.heading')).toBeDefined();
    expect(getByText('ui-invoice.invoice.actions.approve.confirmation.message')).toBeDefined();
    expect(getByText('ui-invoice.button.submit')).toBeDefined();
    expect(getByText('ui-invoice.button.cancel')).toBeDefined();
  });
});
