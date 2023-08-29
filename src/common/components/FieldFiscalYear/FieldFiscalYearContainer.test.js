import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { FieldFiscalYearContainer } from './FieldFiscalYearContainer';

jest.mock('../../hooks', () => ({
  usePayableFiscalYears: jest.fn(() => ({
    fiscalYears: [
      { id: 'fy-1', code: 'FY2022' },
      { id: 'fy-2', code: 'FY2023' },
    ],
  })),
}));

const defaultProps = {
  id: 'fy',
  disabled: false,
  name: 'fiscalYearId',
  required: false,
};

const renderFieldFiscalYearContainer = (props = {}) => render(
  <Form
    onSubmit={jest.fn()}
    render={() => (
      <FieldFiscalYearContainer
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldFiscalYearContainer', () => {
  it('should render fiscal year final form field', () => {
    renderFieldFiscalYearContainer();

    expect(screen.getByLabelText('ui-invoice.invoice.details.information.fiscalYear')).toBeInTheDocument();
  });

  it('should have a required label', () => {
    renderFieldFiscalYearContainer({
      required: true,
    });

    expect(screen.getByText(/required/)).toBeInTheDocument();
  });
});
