import { QueryClient, QueryClientProvider } from 'react-query';
import { useHistory } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { invoice, invoiceLine } from '../../../test/jest/fixtures';
import InvoiceLineForm from './InvoiceLineForm';
import AdjustmentsForm from '../AdjustmentsForm';

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
jest.mock('../../common/hooks/useFundDistributionValidation', () => ({
  useFundDistributionValidation: jest.fn().mockReturnValue({ validateFundDistributionTotal: jest.fn() }),
}));
jest.mock('../AdjustmentsForm', () => jest.fn(() => <span>AdjustmentsForm</span>));
jest.mock('./POLineField', () => ({ POLineField: jest.fn(() => 'POLineField') }));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const defaultProps = {
  initialValues: invoiceLine,
  invoice,
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  vendorCode: 'edi',
};
const renderInvoiceLineForm = (props = defaultProps) => render(
  <InvoiceLineForm {...props} />,
  { wrapper },
);

describe('InvoiceLineForm component', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
    jest.clearAllMocks();
  });

  it('should render correct structure', () => {
    const { container, asFragment } = renderInvoiceLineForm();

    container.querySelector('#invoice-line-form-accordion-set').removeAttribute('aria-multiselectable');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display inactive account warning message when the selected account is inactive', () => {
    const { getByText } = renderInvoiceLineForm({
      ...defaultProps,
      accounts: [
        {
          'name': 'Monographic ordering unit account',
          'accountNo': '1234',
          'accountStatus': 'Inactive',
          'acqUnitIds': [],
        },
      ],
      initialValues: {
        ...invoiceLine,
        accountNumber: '1234',
      },
      values: {
        accountNumber: '1234',
      },
    });

    expect(getByText('ui-invoice.invoiceLine.accountNumber.inactive')).toBeDefined();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      renderInvoiceLineForm();

      act(() => {
        HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();
      });

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderInvoiceLineForm();

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

      renderInvoiceLineForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith('/invoice');
    });

    it('should navigate close form when cancel shortcut is called', () => {
      const onCancel = jest.fn();

      renderInvoiceLineForm({ ...defaultProps, onCancel });
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should pass checkIfAdjustmentIsDisabled to AdjustmentsForm', () => {
    const invoiceWithAdjustments = {
      ...invoice,
      adjustments: [{ id: 'adj1' }, { id: 'adj2' }],
    };

    renderInvoiceLineForm({
      ...defaultProps,
      invoice: invoiceWithAdjustments,
      initialValues: {
        ...invoiceLine,
        adjustments: [{ adjustmentId: 'adj1' }, { adjustmentId: 'adj3' }],
      },
    });

    const props = AdjustmentsForm.mock.calls[0][0];

    expect(props.checkIfAdjustmentIsDisabled).toBeDefined();
    expect(typeof props.checkIfAdjustmentIsDisabled).toBe('function');

    // Test the function
    expect(props.checkIfAdjustmentIsDisabled({ adjustmentId: 'adj1' })).toBe(true);
    expect(props.checkIfAdjustmentIsDisabled({ adjustmentId: 'adj3' })).toBe(false);
    expect(props.checkIfAdjustmentIsDisabled({})).toBe(false);
  });
});
