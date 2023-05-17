import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../../test/jest/__mock__';

import InvoicesListFilters from './InvoicesListFilters';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FundFilter: 'FundFilter',
  ExpenseClassFilter: 'ExpenseClassFilter',
}));
jest.mock('./BatchGroupFilter', () => ({
  BatchGroupFilter: 'BatchGroupFilter',
}));
jest.mock('./FiscalYearFilter', () => ({
  FiscalYearFilter: () => <div>ui-invoice.invoice.details.information.fiscalYear</div>,
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
    renderInvoicesListFilters();

    const totalAmountFilter = await screen.findByText('ui-invoice.invoice.details.information.totalAmount');
    const fiscalYearFilter = await screen.findByText('ui-invoice.invoice.details.information.fiscalYear');

    expect(totalAmountFilter).toBeInTheDocument();
    expect(fiscalYearFilter).toBeInTheDocument();
  });

  it('should render correct structure when disabled', async () => {
    renderInvoicesListFilters({ ...defaultProps, disabled: true });
    const totalAmountFilter = await screen.findByText('ui-invoice.invoice.details.information.totalAmount');
    const applyButton = screen.getAllByRole('textbox', { disabled: true });

    expect(totalAmountFilter).toBeInTheDocument();
    expect(applyButton.length).toBeGreaterThanOrEqual(1);
  });
});
