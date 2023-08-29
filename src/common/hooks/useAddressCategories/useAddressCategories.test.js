import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useAddressCategories } from './useAddressCategories';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const category = { id: '001', value: 'Category' };

describe('useAddressCategories', () => {
  it('should return categoriesMap', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          categories: [category],
        }),
      }),
    });

    const { result } = renderHook(() => useAddressCategories({ categories: ['001'] }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.categoriesMap[category.id]).toEqual(category.value);
  });
});
