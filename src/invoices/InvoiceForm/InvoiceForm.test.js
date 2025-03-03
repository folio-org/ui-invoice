import { Form } from 'react-final-form';
import { MemoryRouter, useHistory } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import { FieldOrganization } from '@folio/stripes-acq-components';

import { vendor } from 'fixtures';
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
  useExchangeCalculation: jest.fn(() => ({ isLoading: false, exchangedAmount: 30 })),
}));

const accounts = [{
  name: 'Test account',
  accountNo: '1234',
  appSystemNo: 'test',
  accountStatus: 'Active',
}];

const defaultProps = {
  initialValues: {},
  batchGroups: [],
  parentResources: {},
  onCancel: jest.fn(),
};
const onSubmitMock = jest.fn();
const renderInvoiceForm = (props = defaultProps) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn()}
      render={() => (
        <InvoiceForm
          form={{}}
          onSubmit={onSubmitMock}
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
    FieldOrganization.mockClear();
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

    expect(getByText(/cancel/)).toBeDefined();
    expect(getByText(/saveAndClose/)).toBeDefined();
  });

  it('should uncheck lock-total initially', () => {
    const { getByTestId } = renderInvoiceForm();

    expect(getByTestId('lock-total').checked).toEqual(false);
  });

  it('should uncheck export to account initially', () => {
    const { getByTestId } = renderInvoiceForm();

    expect(getByTestId('export-to-accounting').checked).toEqual(false);
  });

  it('should change selected \'Accounting code\' value', async () => {
    const { container } = renderInvoiceForm({
      ...defaultProps,
      initialVendor: {
        ...vendor,
        accounts,
      },
    });

    const { accountNo, appSystemNo } = accounts[0];
    const accountLabel = `${accountNo} (${appSystemNo})`;

    expect(container.querySelector('#selected-accounting-code-selection-item')).toHaveTextContent('');

    await userEvent.click(screen.getByRole('button', { name: /invoice.accountingCode/ }));
    await userEvent.click(screen.getByText(accountLabel));

    expect(container.querySelector('#selected-accounting-code-selection-item')).toHaveTextContent(accountLabel);
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

      await userEvent.click(lockTotal, {
        bubbles: true,
        cancelable: true,
      });

      expect(getByTestId('lock-total-amount')).not.toHaveAttribute('readonly');
    });
  });

  describe('When export to accounting is checked', () => {
    it('then accounting code field should be required', async () => {
      await act(async () => {
        await renderInvoiceForm();
      });

      const exportToAccounting = screen.getByTestId('export-to-accounting');

      await userEvent.click(exportToAccounting, {
        bubbles: true,
        cancelable: true,
      });

      expect(screen.getByRole('button', { name: /ui-invoice.invoice.accountingCode Icon/i })).toBeInTheDocument();
    });
  });

  describe('When adjustment export to accounting is checked', () => {
    it('then accounting code field should be required', async () => {
      await act(async () => {
        await renderInvoiceForm({ ...defaultProps, initialValues: { adjustments: [{ exportToAccounting: true }] } });
      });

      expect(screen.getByRole('button', { name: /ui-invoice.invoice.accountingCode Icon/i })).toBeInTheDocument();
    });
  });

  describe('Select vendor', () => {
    it('then export to accounting should be checked', async () => {
      await act(async () => {
        renderInvoiceForm();
      });

      await act(async () => {
        await FieldOrganization.mock.calls[0][0].onSelect({
          ...vendor,
          exportToAccounting: true,
        });
      });

      expect(screen.getByTestId('export-to-accounting').checked).toEqual(true);
    });

    describe('interactions with \'Accounting code\'', () => {
      it('should set the default accounting code if the vendor has an ERP code and does not have any accounts', async () => {
        const { container } = renderInvoiceForm();
        const erpCode = 'ERP-code';

        await act(async () => {
          await FieldOrganization.mock.calls[0][0].onSelect({
            ...vendor,
            erpCode,
          });
        });

        expect(
          container.querySelector('#selected-accounting-code-selection-item'),
        ).toHaveTextContent('ui-invoice.invoice.accountingCode.default');
      });

      it('should clear accounting code if the vendor have an account', async () => {
        const { container } = renderInvoiceForm();

        await act(async () => {
          await FieldOrganization.mock.calls[0][0].onSelect({
            ...vendor,
            accounts,
          });
        });

        expect(container.querySelector('#selected-accounting-code-selection-item')).toHaveTextContent('');
      });
    });
  });

  describe('FieldFiscalYearContainer', () => {
    const labelId = 'ui-invoice.invoice.details.information.fiscalYear';
    const labelIdRequired = `${labelId}<span class="asterisk" aria-hidden="true">*</span>`;
    const optionIdQuery = 'ul[aria-labelledby*="label-invoice-fiscal-year"] li';

    it('should render fiscal year component with empty select option', async () => {
      const optionLengthWithEmptyLine = FISCAL_YEARS.length + 1;
      const { container } = renderInvoiceForm({
        ...defaultProps,
        initialValues: { fiscalYearId: 'fyId' },
      });
      const fiscalYearLabel = await screen.findByText(labelId);

      expect(fiscalYearLabel).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: /details.information.fiscalYear / }));

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

      await userEvent.click(screen.getByRole('button', { name: /details.information.fiscalYear / }));

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
