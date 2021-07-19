import React from 'react';
import { render, screen } from '@testing-library/react';

import { batchGroup } from '../../../../test/jest/fixtures';

import { BatchGroupValue } from './BatchGroupValue';

const defaultProps = {
  id: 'batchGroupId',
  label: 'Batch group',
  mutator: {
    invoiceBatchGroup: {
      GET: jest.fn().mockReturnValue(Promise.resolve(batchGroup)),
    },
  },
};
const renderBatchGroupValue = (props = defaultProps) => render(
  <BatchGroupValue {...props} />,
);

describe('BatchGroupValue', () => {
  it('should display batch group when loaded', async () => {
    renderBatchGroupValue();

    await screen.findByText(batchGroup.name);

    expect(screen.getByText(batchGroup.name)).toBeDefined();
  });

  it('should not display batch group when not loaded', () => {
    renderBatchGroupValue({ ...defaultProps, id: '' });

    expect(screen.queryByText(batchGroup.name)).toBeNull();
  });
});
