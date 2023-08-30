import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
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
  const mockGet = jest.fn(() => ({
    json: () => ({ pieces: [piece] }),
  }));

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: mockGet,
      });
  });

  it('should fetch connected invoice line received pieces', async () => {
    const { result } = renderHook(
      () => useReceivingHistory(orderLine.id),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.pieces[0].id).toEqual(piece.id);
  });

  it('should apply pagination in request if it is set', async () => {
    const pagination = { limit: 50, offset: 100 };

    const { result } = renderHook(
      () => useReceivingHistory(orderLine.id, { pagination }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      {
        searchParams: expect.objectContaining({
          ...pagination,
          query: expect.any(String),
        }),
      },
    );
  });
});
