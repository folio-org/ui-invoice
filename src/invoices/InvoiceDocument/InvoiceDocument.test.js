import { render } from '@folio/jest-config-stripes/testing-library/react';

import InvoiceDocument from './InvoiceDocument';

const renderInvoiceDocument = (props) => (render(
  <InvoiceDocument {...props} />,
));

describe('InvoiceDocument', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should display document name as a button when document can be dowloaded', () => {
    const { asFragment } = renderInvoiceDocument({
      name: 'Invoice Document',
      downloadDocument: jest.fn(),
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display document name as a text when document can not be downloaded', () => {
    const { asFragment } = renderInvoiceDocument({
      name: 'Invoice Document',
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
