import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { DocumentsDetailsContainer } from './DocumentsDetailsContainer';

jest.mock('./DocumentsDetails', () => jest.fn().mockReturnValue('DocumentsDetails'));

const defaultProps = {
  resources: {
    invoiceDocumentsDetails: {
      records: [{ name: 'ABA invoice', id: 'documentId' }],
    },
  },
};
const renderDocumentsDetailsContainer = (props = defaultProps) => render(
  <DocumentsDetailsContainer {...props} />,
);

describe('DocumentsDetailsContainer', () => {
  it('should display DocumentsDetails', () => {
    renderDocumentsDetailsContainer();

    expect(screen.getByText('DocumentsDetails')).toBeDefined();
  });
});
