import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from '../../../../test/jest/fixtures';
import { useReceivingHistory } from './useReceivingHistory';

const piece = {
  id: 'pieceId',
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useReceivingHistory', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({ pieces: [piece] }),
        }),
      });
  });

  it('should fetch connected invoice line received pieces', async () => {
    const { result, waitFor } = renderHook(
      () => useReceivingHistory(orderLine.id),
      { wrapper },
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current.pieces[0].id).toEqual(piece.id);
  });
});
