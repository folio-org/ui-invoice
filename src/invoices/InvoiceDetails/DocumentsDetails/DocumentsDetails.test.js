import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DocumentsDetails from './DocumentsDetails';

const defaultProps = {
  invoiceDocuments: [
    {
      id: 'documentId1',
      name: 'ABA incoice',
      link: 'https://folio.com/document',
    },
    {
      id: 'documentId2',
      name: 'ABA voucher',
      link: 'https://folio.com/voucher',
    },
  ],
};
const renderDocumentsDetails = (props = defaultProps) => render(
  <DocumentsDetails {...props} />,
  { wrapper: MemoryRouter },
);

describe('DocumentsDetails', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render invoice documents', () => {
    const { asFragment } = renderDocumentsDetails();

    expect(asFragment()).toMatchSnapshot();
  });
});
