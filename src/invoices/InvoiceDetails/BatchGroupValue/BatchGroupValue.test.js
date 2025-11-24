import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { batchGroup } from 'fixtures';
import { useBatchGroup } from '../../../common/hooks';
import { BatchGroupValue } from './BatchGroupValue';

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useBatchGroup: jest.fn(),
}));

const defaultProps = {
  id: 'batchGroupId',
  label: 'Batch group',
};
const renderBatchGroupValue = (props = {}) => render(
  <BatchGroupValue
    {...defaultProps}
    {...props}
  />,
);

describe('BatchGroupValue', () => {
  beforeEach(() => {
    useBatchGroup.mockReturnValue({ batchGroup });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display batch group when loaded', async () => {
    renderBatchGroupValue();

    await screen.findByText(batchGroup.name);

    expect(screen.getByText(batchGroup.name)).toBeInTheDocument();
  });

  it('should not display batch group when not loaded', () => {
    useBatchGroup.mockReturnValue({ isBatchGroupLoading: true });

    renderBatchGroupValue({ ...defaultProps, id: '' });

    expect(screen.queryByText(batchGroup.name)).not.toBeInTheDocument();
  });
});
