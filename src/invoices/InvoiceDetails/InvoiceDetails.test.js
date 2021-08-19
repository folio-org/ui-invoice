import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import {
  PAYMENT_STATUS,
} from '@folio/stripes-acq-components';

import { invoice } from '../../../test/jest/fixtures';
import { INVOICE_STATUS } from '../../common/constants';

import InvoiceActions from './InvoiceActions';
import ApproveConfirmationModal from './ApproveConfirmationModal';
import CancellationModal from './CancellationModal';
import InvoiceDetails from './InvoiceDetails';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FundDistributionView: jest.fn(() => 'FundDistributionView'),
  TagsPane: jest.fn(() => 'TagsPane'),
  useAcqRestrictions: jest.fn().mockReturnValue({ restrictions: {} }),
}));

jest.mock('../AdjustmentsDetails', () => jest.fn().mockReturnValue('AdjustmentsDetails'));
jest.mock('../PrintVoucher', () => ({ PrintVoucherContainer: jest.fn(() => 'PrintVoucherContainer') }));

jest.mock('./InvoiceActions', () => jest.fn().mockReturnValue('InvoiceActions'));
jest.mock('./ApproveConfirmationModal', () => jest.fn().mockReturnValue('ApproveConfirmationModal'));
jest.mock('./Information', () => jest.fn().mockReturnValue('Information'));
jest.mock('./InvoiceLines', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('InvoiceLines'),
  InvoiceLinesActions: jest.fn().mockReturnValue('InvoiceLinesActions'),
}));
jest.mock('./VendorDetails', () => jest.fn().mockReturnValue('VendorDetails'));
jest.mock('./VoucherInformation', () => jest.fn().mockReturnValue('VoucherInformation'));
jest.mock('./DocumentsDetails', () => jest.fn().mockReturnValue('DocumentsDetails'));
jest.mock('./InvoiceBatchVoucherExport', () => jest.fn().mockReturnValue('InvoiceBatchVoucherExport'));
jest.mock('./ExtendedInformation', () => jest.fn().mockReturnValue('ExtendedInformation'));
jest.mock('./CancellationModal', () => jest.fn().mockReturnValue('CancellationModal'));

const defaultProps = {
  invoice,
  addLines: jest.fn(),
  approveAndPayInvoice: jest.fn(),
  approveInvoice: jest.fn(),
  createLine: jest.fn(),
  deleteInvoice: jest.fn(),
  cancelInvoice: jest.fn(),
  onClose: jest.fn(),
  onEdit: jest.fn(),
  onUpdate: jest.fn(),
  payInvoice: jest.fn(),
  refreshData: jest.fn(),
  totalInvoiceLines: 0,
};
const renderInvoiceDetails = (props = defaultProps) => render(
  <InvoiceDetails {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceDetails', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  Object.values(INVOICE_STATUS).forEach(invoiceStatus => {
    it(`should render correct structure for ${invoiceStatus} invoice`, () => {
      const { asFragment } = renderInvoiceDetails({
        ...defaultProps,
        invoice: {
          ...invoice,
          status: invoiceStatus,
        },
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('should render correct structure for invoice with batch voucher', () => {
    const { asFragment } = renderInvoiceDetails({
      ...defaultProps,
      invoice: {
        ...invoice,
        status: INVOICE_STATUS.approved,
      },
      batchVoucherExport: {},
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display fully paid POL message when there are paid order lines', () => {
    renderInvoiceDetails({
      ...defaultProps,
      orderlinesMap: {
        'orderLineId': { paymentStatus: PAYMENT_STATUS.fullyPaid },
      },
    });

    expect(screen.getByText('ui-invoice.invoice.details.hasFullyPaidPOLine')).toBeDefined();
  });

  describe('Actions', () => {
    beforeEach(() => {
      InvoiceActions.mockClear();
    });

    describe('Edit', () => {
      it('should call onEdit when edit action is pressed in InvoiceActions', () => {
        const onEdit = jest.fn();

        renderInvoiceDetails({
          ...defaultProps,
          onEdit,
        });

        act(() => {
          InvoiceActions.mock.calls[0][0].onEdit();
        });

        expect(onEdit).toHaveBeenCalled();
      });
    });

    describe('Cancel', () => {
      it('should open CancellationModal when cancel action is pressed in InvoiceActions', async () => {
        renderInvoiceDetails({
          ...defaultProps,
          onInvoiceCancel: jest.fn(),
        });

        await waitFor(() => InvoiceActions.mock.calls[0][0].onInvoiceCancel());

        expect(screen.getByText('CancellationModal')).toBeInTheDocument();
      });

      it('should ', async () => {
        renderInvoiceDetails({
          ...defaultProps,
          onInvoiceCancel: jest.fn(),
        });

        await waitFor(() => InvoiceActions.mock.calls[0][0].onInvoiceCancel());
        await waitFor(() => CancellationModal.mock.calls[0][0].onConfirm());

        expect(defaultProps.cancelInvoice).toHaveBeenCalled();
      });
    });

    describe('Delete', () => {
      it('should open confirmation modal when Delete invoice action is called', () => {
        renderInvoiceDetails();

        act(() => {
          InvoiceActions.mock.calls[0][0].onDelete();
        });

        expect(screen.getByText('ui-invoice.invoice.delete.message')).toBeDefined();
      });

      it('should call deleteInvoice when delete action is confirmed', () => {
        const deleteInvoice = jest.fn();

        renderInvoiceDetails({
          ...defaultProps,
          deleteInvoice,
        });

        act(() => {
          InvoiceActions.mock.calls[0][0].onDelete();
        });
        user.click(screen.getByText('ui-invoice.invoice.delete.confirmLabel'));

        expect(deleteInvoice).toHaveBeenCalled();
      });
    });

    describe('Approve', () => {
      it('should open confirmation modal when Approve invoice action is called', () => {
        renderInvoiceDetails();

        act(() => {
          InvoiceActions.mock.calls[0][0].onApprove();
        });

        expect(screen.getByText('ApproveConfirmationModal')).toBeDefined();
      });

      it('should call approveInvoice when approve action is confirmed', () => {
        ApproveConfirmationModal.mockClear();

        const approveInvoice = jest.fn();

        renderInvoiceDetails({
          ...defaultProps,
          approveInvoice,
        });

        act(() => {
          InvoiceActions.mock.calls[0][0].onApprove();
        });
        act(() => {
          ApproveConfirmationModal.mock.calls[0][0].onConfirm();
        });

        expect(approveInvoice).toHaveBeenCalled();
      });
    });

    describe('Pay', () => {
      it('should open confirmation modal when Pay invoice action is called', () => {
        renderInvoiceDetails();

        act(() => {
          InvoiceActions.mock.calls[0][0].onPay();
        });

        expect(screen.getByText('ui-invoice.invoice.actions.pay.confirmation.message')).toBeDefined();
      });

      it('should call payInvoice when pay is confirmed', () => {
        const payInvoice = jest.fn();

        renderInvoiceDetails({
          ...defaultProps,
          payInvoice,
        });

        act(() => {
          InvoiceActions.mock.calls[0][0].onPay();
        });
        user.click(screen.getByText('stripes-components.submit'));

        expect(payInvoice).toHaveBeenCalled();
      });
    });

    describe('Approve and Pay', () => {
      it('should open confirmation modal when Approve&Pay invoice action is called', () => {
        renderInvoiceDetails();

        act(() => {
          InvoiceActions.mock.calls[0][0].onApproveAndPay();
        });

        expect(screen.getByText('ui-invoice.invoice.actions.approveAndPay.confirmation.message')).toBeDefined();
      });

      it('should call approveAndPayInvoice when Approve&Pay is confirmed', () => {
        const approveAndPayInvoice = jest.fn();

        renderInvoiceDetails({
          ...defaultProps,
          approveAndPayInvoice,
        });

        act(() => {
          InvoiceActions.mock.calls[0][0].onApproveAndPay();
        });
        user.click(screen.getByText('stripes-components.submit'));

        expect(approveAndPayInvoice).toHaveBeenCalled();
      });
    });

    describe('Print voucher', () => {
      it('should open print voucher modal when Print invoice action is called', () => {
        renderInvoiceDetails({
          ...defaultProps,
          invoice: {
            ...invoice,
            status: INVOICE_STATUS.approved,
          },
        });

        act(() => {
          InvoiceActions.mock.calls[0][0].onPrint();
        });

        expect(screen.getByText('PrintVoucherContainer')).toBeDefined();
      });
    });
  });

  describe('Tags', () => {
    it('should open tags pane when badge is clicked', () => {
      renderInvoiceDetails();

      user.click(screen.getAllByTitle('stripes-acq-components.showTags')[0]);

      expect(screen.getByText('TagsPane')).toBeDefined();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      renderInvoiceDetails();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();
      });

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderInvoiceDetails();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();
      });

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should call onEdit when edit shortcut is called', () => {
      const onEdit = jest.fn();

      renderInvoiceDetails({ ...defaultProps, onEdit });
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(onEdit).toHaveBeenCalled();
    });

    it('should navigate to invoice form when new shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderInvoiceDetails();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(pushMock).toHaveBeenCalledWith('/invoice/create');
    });
  });
});
