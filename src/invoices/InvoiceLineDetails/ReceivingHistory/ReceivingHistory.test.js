import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';

import { orderLine } from '../../../../test/jest/fixtures';

import { useReceivingHistory } from './useReceivingHistory';
import ReceivingHistory from './ReceivingHistory';

jest.mock('./useReceivingHistory', () => ({
  useReceivingHistory: jest.fn(),
}));

const caption = 'testCaption';
const defaultProps = {
  poLine: orderLine,
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <IntlProvider locale="en">
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </IntlProvider>
  </MemoryRouter>
);

const renderReceivingHistory = (props = {}) => render(
  <ReceivingHistory
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('ReceivingHistory', () => {
  beforeEach(() => {
    useReceivingHistory.mockClear().mockReturnValue({
      isLoading: false,
      pieces: [{ caption }],
    });
  });

  it('should render received pieces list', () => {
    renderReceivingHistory();

    expect(screen.getByText('ui-invoice.receivingHistory')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.receivingHistory.caption')).toBeInTheDocument();
    expect(screen.getByText(caption)).toBeInTheDocument();
  });
});
