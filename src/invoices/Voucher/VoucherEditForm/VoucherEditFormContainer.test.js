import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { history, location, match, invoice, batchVoucher } from '../../../../test/jest/fixtures';

import VoucherEditForm from './VoucherEditForm';
import { VoucherEditContainerComponent } from './VoucherEditContainer';

jest.mock('./VoucherEditForm', () => jest.fn().mockReturnValue('VoucherEditForm'));

const historyMock = {
  ...history,
  push: jest.fn(),
};
const matchMock = {
  ...match,
  params: {
    id: 'id',
    voucherId: 'voucherId',
  },
};
const mutatorMock = {
  voucher: {
    GET: jest.fn().mockReturnValue(Promise.resolve(batchVoucher)),
    PUT: jest.fn().mockReturnValue(Promise.resolve()),
  },
  invoice: {
    GET: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  },
  configVoucherNumber: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
};
const defaultProps = {
  mutator: mutatorMock,
  history: historyMock,
  location,
  match: matchMock,
};
const renderVoucherEditContainerComponent = (props = defaultProps) => render(
  <VoucherEditContainerComponent {...props} />,
);

describe('VoucherEditContainerComponent', () => {
  beforeEach(() => {
    VoucherEditForm.mockClear();
  });

  it('should display VoucherEditForm when loaded', async () => {
    renderVoucherEditContainerComponent();

    await screen.findByText('VoucherEditForm');

    expect(screen.getByText('VoucherEditForm')).toBeDefined();
  });

  it('should fetch voucher when mounted', async () => {
    mutatorMock.voucher.GET.mockClear();

    renderVoucherEditContainerComponent();

    await screen.findByText('VoucherEditForm');

    expect(mutatorMock.voucher.GET).toHaveBeenCalled();
  });

  it('should fetch invoice when mounted', async () => {
    mutatorMock.invoice.GET.mockClear();

    renderVoucherEditContainerComponent();

    await screen.findByText('VoucherEditForm');

    expect(mutatorMock.invoice.GET).toHaveBeenCalled();
  });

  it('should fetch voucher config when mounted', async () => {
    mutatorMock.configVoucherNumber.GET.mockClear();

    renderVoucherEditContainerComponent();

    await screen.findByText('VoucherEditForm');

    expect(mutatorMock.configVoucherNumber.GET).toHaveBeenCalled();
  });

  describe('Actions', () => {
    it('should redirect to voucher view when form cancel is called', async () => {
      historyMock.push.mockClear();
      renderVoucherEditContainerComponent();

      await screen.findByText('VoucherEditForm');

      VoucherEditForm.mock.calls[0][0].onCancel();

      expect(historyMock.push).toHaveBeenCalledWith({
        pathname: `/invoice/view/${matchMock.params.id}/voucher/${matchMock.params.voucherId}/view`,
        search: location.search,
      });
    });

    it('should make put request when submit action is called', async () => {
      mutatorMock.voucher.PUT.mockClear();

      renderVoucherEditContainerComponent();

      await screen.findByText('VoucherEditForm');

      VoucherEditForm.mock.calls[0][0].onSubmit();

      expect(mutatorMock.voucher.PUT).toHaveBeenCalled();
    });
  });
});
