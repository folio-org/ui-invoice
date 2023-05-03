import { render, screen } from '@testing-library/react';

import { FiscalYearValueContainer } from './FiscalYearValueContainer';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useFiscalYear: jest.fn(() => ({
    fiscalYear: { id: 'fiscalYearId', code: 'FY2023' },
  })),
}));

const defaultProps = {
  fiscalYearId: 'fiscalYearId',
};

const renderFiscalYearValueContainer = (props = {}) => render(
  <FiscalYearValueContainer
    {...defaultProps}
    {...props}
  />,
);

describe('FiscalYearValueContainer', () => {
  it('should fetch fiscal year by ID and display as key-value', () => {
    renderFiscalYearValueContainer();

    expect(screen.getByText('ui-invoice.invoice.details.information.fiscalYear')).toBeInTheDocument();
    expect(screen.getByText('FY2023')).toBeInTheDocument();
  });
});
