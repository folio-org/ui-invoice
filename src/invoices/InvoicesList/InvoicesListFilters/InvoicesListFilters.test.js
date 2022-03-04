import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../../test/jest/__mock__';

import InvoicesListFilters from './InvoicesListFilters';

jest.mock('./BatchGroupFilter', () => ({
  BatchGroupFilter: 'BatchGroupFilter',
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};
const renderInvoicesListFilters = (props = defaultProps) => render(
  <InvoicesListFilters {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoicesListFilters', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { container, asFragment } = renderInvoicesListFilters();

    container.querySelector('#invoice-filters-accordion-set').removeAttribute('aria-multiselectable');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correct structure when disabled', async () => {
    const { container, asFragment } = renderInvoicesListFilters({ ...defaultProps, disabled: true });

    container.querySelector('#invoice-filters-accordion-set').removeAttribute('aria-multiselectable');

    expect(asFragment()).toMatchSnapshot();
  });
});
