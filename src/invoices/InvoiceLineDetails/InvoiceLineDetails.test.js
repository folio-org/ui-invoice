import React from 'react';
import { render, screen, act } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import '../../../test/jest/__mock__';

import { invoiceLine, orderLine } from '../../../test/jest/fixtures';

import ActionMenu from './ActionMenu';
import InvoiceLineDetails from './InvoiceLineDetails';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FundDistributionView: jest.fn(() => 'FundDistributionView'),
}));

jest.mock('./OtherRelatedInvoiceLines', () => ({
  OtherRelatedInvoiceLines: jest.fn().mockReturnValue('OtherRelatedInvoiceLines'),
}));
jest.mock('../AdjustmentsDetails', () => jest.fn().mockReturnValue('AdjustmentsDetails'));

jest.mock('./ActionMenu', () => jest.fn().mockReturnValue('ActionMenu'));
jest.mock('./InvoiceLineInformation', () => jest.fn().mockReturnValue('InvoiceLineInformation'));
jest.mock('./ReceivingHistory', () => ({
  ReceivingHistory: jest.fn().mockReturnValue('ReceivingHistory'),
}));

const defaultProps = {
  invoiceLine,
  invoiceStatus: 'Approved',
  poLine: orderLine,
  currency: 'USD',
  closeInvoiceLine: jest.fn(),
  deleteInvoiceLine: jest.fn(),
  goToEditInvoiceLine: jest.fn(),
  tagsToggle: jest.fn(),
  vendorInvoiceNo: '1234',
  vendorCode: 'AMZN',
  otherRelatedInvoiceLines: [{ id: 'invoiceLineId' }],
};
const renderInvoiceLineDetails = (props = defaultProps) => render(
  <InvoiceLineDetails {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLineDetails', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct subtitle for invoice line', () => {
    renderInvoiceLineDetails();
    const subTitle = `${defaultProps.vendorInvoiceNo} - ${defaultProps.vendorCode}`;

    expect(screen.getByText(subTitle)).toBeInTheDocument();
  });

  describe('Actions', () => {
    beforeEach(() => {
      ActionMenu.mockClear();
    });

    describe('Edit', () => {
      it('should call goToEditInvoiceLine when edit action is pressed in ActionMenu', () => {
        const goToEditInvoiceLine = jest.fn();

        renderInvoiceLineDetails({
          ...defaultProps,
          goToEditInvoiceLine,
        });

        act(() => {
          ActionMenu.mock.calls[0][0].onEdit();
        });

        expect(goToEditInvoiceLine).toHaveBeenCalled();
      });
    });

    describe('Delete', () => {
      it('should open confirmation modal when Delete invoice line action is called', () => {
        renderInvoiceLineDetails();

        act(() => {
          ActionMenu.mock.calls[0][0].onDelete();
        });

        expect(screen.getByText('ui-invoice.invoiceLine.delete.message')).toBeDefined();
      });

      it('should call deleteInvoiceLine when delete action is confirmed', () => {
        const deleteInvoiceLine = jest.fn();

        renderInvoiceLineDetails({
          ...defaultProps,
          deleteInvoiceLine,
        });

        act(() => {
          ActionMenu.mock.calls[0][0].onDelete();
        });
        user.click(screen.getByText('ui-invoice.invoiceLine.delete.confirmLabel'));

        expect(deleteInvoiceLine).toHaveBeenCalled();
      });
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      renderInvoiceLineDetails();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();
      });

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderInvoiceLineDetails();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();
      });

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should call goToEditInvoiceLine when edit shortcut is called', () => {
      const goToEditInvoiceLine = jest.fn();

      renderInvoiceLineDetails({ ...defaultProps, goToEditInvoiceLine });
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(goToEditInvoiceLine).toHaveBeenCalled();
    });
  });
});
