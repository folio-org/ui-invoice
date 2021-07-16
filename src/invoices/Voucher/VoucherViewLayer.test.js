import React from 'react';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import {
  invoice,
  batchVoucher,
  batchVoucherLine,
  history,
  location,
  match,
} from '../../../test/jest/fixtures';

import { useVoucher } from './useVoucher';
import VoucherViewLayer from './VoucherViewLayer';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));

jest.mock('../PrintVoucher', () => ({ PrintVoucherContainer: jest.fn(() => 'PrintVoucherContainer') }));
jest.mock('./useVoucher', () => ({ useVoucher: jest.fn() }));
jest.mock('./VoucherView', () => {
  const { forwardRef } = jest.requireActual('react');

  return forwardRef(() => 'VoucherView');
});

const historyMock = {
  ...history,
  push: jest.fn(),
};
const matchParams = {
  id: 'id',
  voucherId: 'voucherId',
};
const defaultProps = {
  history: historyMock,
  location,
  match: {
    ...match,
    params: matchParams,
  },
};
const renderVoucherViewLayer = (props = defaultProps) => render(
  <VoucherViewLayer {...props} />,
  { wrapper: MemoryRouter },
);

describe('VoucherViewLayer', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;

    useVoucher.mockClear().mockReturnValue({
      isLoading: false,
      invoice,
      voucher: batchVoucher,
      voucherLines: [batchVoucherLine],
    });
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', () => {
    const { asFragment } = renderVoucherViewLayer();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      renderVoucherViewLayer();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();
      });

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderVoucherViewLayer();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();
      });

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should navigate to voucher edit form when edit shortcut is called', () => {
      historyMock.push.mockClear();

      renderVoucherViewLayer();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(historyMock.push).toHaveBeenCalledWith({
        search: location.search,
        pathname: `/invoice/view/${matchParams.id}/voucher/${matchParams.voucherId}/edit`,
      });
    });

    it('should navigate to invoices list when search shortcut is called', () => {
      historyMock.push.mockClear();

      renderVoucherViewLayer();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(historyMock.push).toHaveBeenCalledWith('/invoice');
    });
  });
});
