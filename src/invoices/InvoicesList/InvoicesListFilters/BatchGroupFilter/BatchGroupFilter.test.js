import React from 'react';
import { render, screen } from '@testing-library/react';
import { noop } from 'lodash';

import { useBatchGroupOptions } from './useBatchGroupOptions';
import BatchGroupFilter from './BatchGroupFilter';

jest.mock('./useBatchGroupOptions', () => ({
  useBatchGroupOptions: jest.fn(),
}));

const labelId = 'labelId';

const renderFilter = () => (render(
  <BatchGroupFilter
    id="filterId"
    activeFilters={[]}
    name="filterName"
    onChange={noop}
    labelId={labelId}
  />,
));

describe('BatchGroupFilter', () => {
  beforeEach(() => {
    useBatchGroupOptions.mockClear().mockReturnValue({ isLoading: false, batchGroupOptions: [] });
  });

  it('should display filter title', () => {
    renderFilter();

    expect(screen.getByText(labelId)).toBeInTheDocument();
  });

  it('should be closed by default', () => {
    renderFilter();

    expect(screen.getByLabelText(`${labelId} filter list`).getAttribute('aria-expanded') || 'false').toBe('false');
  });
});
