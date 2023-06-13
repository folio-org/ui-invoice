import { renderHook } from '@testing-library/react-hooks';
import { useFrontendPaginatedData } from './useFrontendPaginatedData';

const data = [
  { id: '1', name: 'name1' },
  { id: '2', name: 'name2' },
  { id: '3', name: 'name3' },
  { id: '4', name: 'name4' },
];

describe('useOrders', () => {
  it('should return 1 data with the limit 1', async () => {
    const pagination = { limit: 1, offset: 0 };
    const { result } = renderHook(() => useFrontendPaginatedData(data, pagination));

    expect(result.current.length).toBe(1);
  });
});
