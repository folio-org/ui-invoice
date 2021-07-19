import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { act, render, fireEvent } from '@testing-library/react';
import { useHistory } from 'react-router';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import InvoiceForm from './InvoiceForm';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});
jest.mock('../AdjustmentsForm', () => {
  return () => <span>AdjustmentsForm</span>;
});

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
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', () => {
    const { asFragment } = renderInvoiceForm();

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
