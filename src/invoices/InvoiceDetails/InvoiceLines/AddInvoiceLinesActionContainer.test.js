import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen, act } from '@folio/jest-config-stripes/testing-library/react';

import { orderLine } from '../../../../test/jest/fixtures';

import AddInvoiceLinesAction from './AddInvoiceLinesAction';
import { AddInvoiceLinesActionContainerComponent } from './AddInvoiceLinesActionContainer';

jest.mock('./AddInvoiceLinesAction', () => jest.fn().mockReturnValue('AddInvoiceLinesAction'));

const mutatorMock = {
  orders: {
    GET: jest.fn().mockReturnValue(Promise.resolve([{ vendor: 'orderVendorId' }])),
  },
};
const defaultProps = {
  addLines: jest.fn(),
  invoiceCurrency: 'USD',
  invoiceVendorId: 'invoiceVendorId',
  isDisabled: false,
  mutator: mutatorMock,
};
const renderAddInvoiceLinesActionContainer = (props = defaultProps) => render(
  <AddInvoiceLinesActionContainerComponent {...props} />,
);

describe('AddInvoiceLinesActionContainer', () => {
  beforeEach(() => {
    AddInvoiceLinesAction.mockClear();
  });

  it('should display AddInvoiceLinesAction', () => {
    renderAddInvoiceLinesActionContainer();

    expect(screen.getByText('AddInvoiceLinesAction')).toBeDefined();
  });

  describe('Actions', () => {
    it('should add lines when addLines prop is called', () => {
      const addLines = jest.fn();

      renderAddInvoiceLinesActionContainer({ ...defaultProps, addLines });

      AddInvoiceLinesAction.mock.calls[0][0].addLines();

      expect(addLines).toHaveBeenCalled();
    });

    it(
      'should open different vendor confirmation modal when selected order lines vendors are not matched with invoice vendor',
      async () => {
        renderAddInvoiceLinesActionContainer();

        act(() => {
          AddInvoiceLinesAction.mock.calls[0][0].validateSelectedRecords([orderLine]);
        });

        await screen.findByText('ui-invoice.invoice.actions.addLine.vendorMessage');

        expect(screen.getByText('ui-invoice.invoice.actions.addLine.vendorMessage')).toBeDefined();
      },
    );

    it('should add lines when lines with not matched vendors are confirmed and currencies are matched', async () => {
      const addLines = jest.fn();

      renderAddInvoiceLinesActionContainer({ ...defaultProps, addLines });

      act(() => {
        AddInvoiceLinesAction.mock.calls[0][0].validateSelectedRecords([orderLine]);
      });

      await screen.findByText('ui-invoice.invoice.actions.addLine.vendorMessage');
      await user.click(screen.getByText('ui-invoice.invoice.actions.addLine.confirmLabel'));

      expect(addLines).toHaveBeenCalled();
    });

    it('should open currencies modal when currencies are matched', async () => {
      renderAddInvoiceLinesActionContainer({ ...defaultProps, invoiceCurrency: 'RUB' });

      act(() => {
        AddInvoiceLinesAction.mock.calls[0][0].validateSelectedRecords([orderLine]);
      });

      await screen.findByText('ui-invoice.invoice.actions.addLine.vendorMessage');
      await user.click(screen.getByText('ui-invoice.invoice.actions.addLine.confirmLabel'));

      expect(screen.getByText('ui-invoice.invoice.actions.addLine.currencyMessage')).toBeDefined();
    });

    it('should add lines modal when different currencies are confirmed', async () => {
      const addLines = jest.fn();

      renderAddInvoiceLinesActionContainer({ ...defaultProps, addLines, invoiceCurrency: 'RUB' });

      act(() => {
        AddInvoiceLinesAction.mock.calls[0][0].validateSelectedRecords([orderLine]);
      });

      await screen.findByText('ui-invoice.invoice.actions.addLine.vendorMessage');
      await user.click(screen.getByText('ui-invoice.invoice.actions.addLine.confirmLabel'));
      await screen.findByText('ui-invoice.invoice.actions.addLine.currencyMessage');
      await user.click(screen.getByText('ui-invoice.invoice.actions.addLine.confirmLabel'));

      expect(addLines).toHaveBeenCalled();
    });
  });
});
