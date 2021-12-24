import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useAddressCategories({ categories: ['001'] }), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.categoriesMap[category.id]).toEqual(category.value);
  });
});
