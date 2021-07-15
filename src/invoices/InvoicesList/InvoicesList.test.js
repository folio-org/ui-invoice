import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {
  HasCommand,
} from '@folio/stripes/components';

import { invoice, history, location } from '../../../test/jest/fixtures';

import { InvoicesList } from './InvoicesList';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
  };
});

jest.mock('./InvoicesListFilters', () => jest.fn().mockReturnValue('InvoicesListFilters'));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  invoicesCount: 1,
  invoices: [invoice],
  isLoading: false,
  location,
  history: historyMock,
};
const renderInvoicesList = (props = defaultProps) => (render(
  <InvoicesList {...props} />,
  { wrapper: MemoryRouter },
));

describe('InvoicesList', () => {
  describe('Filters section', () => {
    it('should display search control', () => {
      const { getByText } = renderInvoicesList();

      expect(getByText('SingleSearchForm')).toBeDefined();
    });

    it('should display reset filters control', () => {
      const { getByText } = renderInvoicesList();

      expect(getByText('ResetButton')).toBeDefined();
    });

    it('should display org filters', () => {
      const { getByText } = renderInvoicesList();

      expect(getByText('InvoicesListFilters')).toBeDefined();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
    });

    it('should navigate to form when new shortcut is called', () => {
      historyMock.push.mockClear();

      renderInvoicesList();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(historyMock.push).toHaveBeenCalledWith('/invoice/create');
    });
  });
});
