import noop from 'lodash/noop';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useFiscalYears } from '../../../../common/hooks';
import { FiscalYearFilter } from './FiscalYearFilter';

jest.mock('../../../../common/hooks', () => ({
  useFiscalYears: jest.fn(),
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
    useFiscalYears.mockClear().mockReturnValue({ fiscalYears: fiscalYearsMock, isLoading: false });
  });

  it('should display filter title', async () => {
    renderFilter();

    expect(screen.getByText(labelId)).toBeInTheDocument();
    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    expect(screen.getByText(fiscalYearsMock[0].code)).toBeInTheDocument();
    expect(screen.getByText(fiscalYearsMock[1].code)).toBeInTheDocument();
  });

  it('should display spinner element', () => {
    useFiscalYears.mockClear().mockReturnValue({ fiscalYears: fiscalYearsMock, isLoading: true });
    const { container } = renderFilter();
    const spinnerElement = container.querySelector('.spinner');

    expect(spinnerElement).toBeInTheDocument();
  });
});
