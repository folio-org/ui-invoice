import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';

import { InvoicesListLastMenu } from './InvoicesListLastMenu';

const defaultProps = {
  onToggle: jest.fn(),
  invoicesCount: 1,
};

const renderInvoicesListLastMenu = (props = defaultProps) => render(
  <InvoicesListLastMenu {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoicesListLastMenu', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { asFragment } = renderInvoicesListLastMenu();

    expect(asFragment()).toMatchSnapshot();
  });
});
