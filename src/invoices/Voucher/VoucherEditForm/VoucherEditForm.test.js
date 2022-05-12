import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

import {
  HasCommand,
} from '@folio/stripes/components';

import { batchVoucher } from '../../../../test/jest/fixtures';

import VoucherEditForm from './VoucherEditForm';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));

const defaultProps = {
  onSubmit: jest.fn(),
  initialValues: batchVoucher,
  onCancel: jest.fn(),
  vendorInvoiceNo: 'vendorInvoiceNo',
};
const renderVoucherEditForm = (props = defaultProps) => render(
  <VoucherEditForm {...props} />,
  { wrapper: MemoryRouter },
);

describe('VoucherEditForm', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct voucher form structure', () => {
    const { asFragment } = renderVoucherEditForm();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correct voucher form structure with editable voucher number', () => {
    const { asFragment } = renderVoucherEditForm({
      ...defaultProps,
      isAllowVoucherNumberEdit: true,
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call onCancel prop when cancel button is pressed', () => {
    const onCancel = jest.fn();

    renderVoucherEditForm({
      ...defaultProps,
      onCancel,
    });

    user.click(screen.getByText('stripes-acq-components.FormFooter.cancel'));

    expect(onCancel).toHaveBeenCalled();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
    });

    it('should cancel form when cancel shortcut is called', () => {
      defaultProps.onCancel.mockClear();

      renderVoucherEditForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should navigate to list view when search shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderVoucherEditForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith('/invoice');
    });
  });
});
