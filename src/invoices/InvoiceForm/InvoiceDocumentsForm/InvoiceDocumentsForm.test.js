import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import stripesFinalForm from '@folio/stripes/final-form';

import InvoiceDocumentsForm from './InvoiceDocumentsForm';

const TestForm = stripesFinalForm({})(
  (props) => {
    return (
      <form>
        <InvoiceDocumentsForm {...props} />
      </form>
    );
  },
);

const renderForm = ({
  isNonInteractive = false,
  initialValues = {},
  push = jest.fn(),
} = {}) => render(
  <TestForm
    onSubmit={jest.fn()}
    initialValues={initialValues}
    isNonInteractive={isNonInteractive}
    push={push}
  />,
  { wrapper: MemoryRouter },
);

describe('InvoiceDocumentsForm', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure with defined adjustments', async () => {
    const { asFragment } = renderForm({
      initialValues: {
        documents: [{ id: 'documentId', name: 'Invoice document' }, { name: 'Document link' }],
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
