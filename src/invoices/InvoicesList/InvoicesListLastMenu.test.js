import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';

import { location } from '../../../test/jest/fixtures';

import { InvoicesListLastMenuComponent } from './InvoicesListLastMenu';

const renderInvoicesListLastMenu = () => render(
  <InvoicesListLastMenuComponent location={location} />,
  { wrapper: MemoryRouter },
);

describe('OrganizationsListLastMenu', () => {
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
