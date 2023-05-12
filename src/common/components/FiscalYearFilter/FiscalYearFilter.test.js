import React from 'react';
import { render, screen } from '@testing-library/react';
import { noop } from 'lodash';

import { FiscalYearFilter } from './FiscalYearFilter';
import { usePayableFiscalYears } from '../../hooks';

jest.mock('../../hooks', () => ({
  usePayableFiscalYears: jest.fn(),
}));

const labelId = 'fiscalYearId';
const fiscalYearsMock = [
  { id: 'fy-1', code: 'FY2022' },
  { id: 'fy-2', code: 'FY2023' },
];

const renderFilter = () => (render(
  <FiscalYearFilter
    id="fiscalYear"
    activeFilters={[]}
    name="fiscalYear"
    onChange={noop}
    labelId={labelId}
  />,
));

describe('FiscalYearFilter', () => {
  beforeEach(() => {
    usePayableFiscalYears.mockClear().mockReturnValue({ fiscalYears: fiscalYearsMock, isLoading: false });
  });

  it('should display filter title', () => {
    renderFilter();

    expect(screen.getByText(labelId)).toBeInTheDocument();
    expect(screen.getByText(fiscalYearsMock[0].code)).toBeInTheDocument();
    expect(screen.getByText(fiscalYearsMock[1].code)).toBeInTheDocument();
  });

  it('should display spinner element', () => {
    usePayableFiscalYears.mockClear().mockReturnValue({ fiscalYears: fiscalYearsMock, isLoading: true });
    const { container } = renderFilter();
    const spinnerElement = container.querySelector('.spinner');

    expect(spinnerElement).toBeInTheDocument();
  });
});
