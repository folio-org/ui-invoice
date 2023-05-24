import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { act, render, fireEvent, screen } from '@testing-library/react';
import { useHistory } from 'react-router';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import { FieldOrganization } from '@folio/stripes-acq-components';

import InvoiceForm from './InvoiceForm';

const FISCAL_YEARS = [{ code: 'FY2023', id: 'fyId' }];

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/NoValue', () => {
  return () => <span>-</span>;
});
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitsField: () => <span>AcqUnitsField</span>,
  FieldOrganization: jest.fn(() => <span>FieldOrganization</span>),
}));
jest.mock('../AdjustmentsForm', () => {
  return () => <span>AdjustmentsForm</span>;
});
jest.mock('../../common/components/VendorPrimaryAddress', () => ({
  VendorPrimaryAddress: () => <span>VendorPrimaryAddress</span>,
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  usePayableFiscalYears: jest.fn(() => ({ fiscalYears: FISCAL_YEARS })),
}));

const defaultProps = {
  initialValues: {},
  batchGroups: [],
  parentResources: {},
  onCancel: jest.fn(),
};
const renderInvoiceForm = (props = defaultProps) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn()}
      render={() => (
        <InvoiceForm
          form={{}}
          onSubmit={jest.fn()}
          pristine={false}
          submitting={false}
          {...props}
        />
      )}
    />
  </MemoryRouter>,
));

describe('InvoiceForm component', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
    FieldOrganization.mockClear();
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', () => {
    const { container, asFragment } = renderInvoiceForm();

    container.querySelector('#invoice-form-accordion-set').removeAttribute('aria-multiselectable');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display title', () => {
    const { getByText } = renderInvoiceForm();

    expect(getByText('ui-invoice.invoice.paneTitle.create')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderInvoiceForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('ui-invoice.saveAndClose')).toBeDefined();
  });

  it('should uncheck lock-total initially', () => {
    const { getByTestId } = renderInvoiceForm();

    expect(getByTestId('lock-total').checked).toEqual(false);
  });

  it('should uncheck export to account initially', () => {
    const { getByTestId } = renderInvoiceForm();

    expect(getByTestId('export-to-accounting').checked).toEqual(false);
  });

  describe('When lock total is unchecked', () => {
    it('then lock total amount is readonly', () => {
      const { getByTestId } = renderInvoiceForm();

      expect(getByTestId('lock-total-amount')).toHaveAttribute('readonly');
    });
  });

  describe('When lock total is checked', () => {
    it('then lock total amount field should become editable', async () => {
      let getByTestId;

      await act(async () => {
        const renderer = await renderInvoiceForm();

        getByTestId = renderer.getByTestId;
      });

      const lockTotal = getByTestId('lock-total');

      fireEvent(lockTotal, new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(getByTestId('lock-total-amount')).not.toHaveAttribute('readonly');
    });
  });

  describe('When export to accounting is checked', () => {
    it('then accounting code field should be required', async () => {
      await act(async () => {
        await renderInvoiceForm();
      });

      const exportToAccounting = screen.getByTestId('export-to-accounting');

      fireEvent(exportToAccounting, new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(screen.getByRole('button', { name: /ui-invoice.invoice.accountingCode Icon required/i })).toBeInTheDocument();
    });
  });

  describe('When adjustment export to accounting is checked', () => {
    it('then accounting code field should be required', async () => {
      await act(async () => {
        await renderInvoiceForm({ ...defaultProps, initialValues: { adjustments: [{ exportToAccounting: true }] } });
      });

      expect(screen.getByRole('button', { name: /ui-invoice.invoice.accountingCode Icon required/i })).toBeInTheDocument();
    });
  });

  describe('Select vendor', () => {
    it('then export to accounting should be checked', async () => {
      await act(async () => {
        renderInvoiceForm();
      });

      await act(async () => {
        await FieldOrganization.mock.calls[0][0].onSelect({ id: 'vendorId', exportToAccounting: true });
      });

      expect(screen.getByTestId('export-to-accounting').checked).toEqual(true);
    });
  });

  describe('FieldFiscalYearContainer', () => {
    const labelId = 'ui-invoice.invoice.details.information.fiscalYear';
    const labelIdRequired = `${labelId}<span class="asterisk" aria-hidden="true">*</span>`;
    const optionIdQuery = 'li[id^="option-invoice-fiscal-year"]';

    it('should render fiscal year component with empty select option', async () => {
      const optionLengthWithEmptyLine = FISCAL_YEARS.length + 1;
      const { container } = renderInvoiceForm({
        ...defaultProps,
        initialValues: { fiscalYearId: 'fyId' },
      });
      const fiscalYearLabel = await screen.findByText(labelId);

      expect(fiscalYearLabel).toBeInTheDocument();

      const fiscalYearOptions = container.querySelectorAll(optionIdQuery);

      expect(fiscalYearOptions.length).toBe(optionLengthWithEmptyLine);
    });

    it('should render edit fiscal year component with required "*" sign and not to have empty input selection', async () => {
      const { container } = renderInvoiceForm({
        ...defaultProps,
        initialValues: { fiscalYearId: 'fyId', id: 'invoiceId' },
      });
      const fiscalYearLabel = await screen.findByText(labelId);

      expect(fiscalYearLabel.innerHTML).toBe(labelIdRequired);

      const fiscalYearOptions = container.querySelectorAll(optionIdQuery);

      expect(fiscalYearOptions.length).toBe(FISCAL_YEARS.length);
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      renderInvoiceForm();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();
      });

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderInvoiceForm();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();
      });

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should navigate to list when search shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderInvoiceForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith('/invoice');
    });

    it('should navigate close form when cancel shortcut is called', () => {
      const onCancel = jest.fn();

      renderInvoiceForm({ ...defaultProps, onCancel });
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(onCancel).toHaveBeenCalled();
    });
  });
});
