import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, render } from '@testing-library/react';
import { useHistory } from 'react-router';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import '../../../test/jest/__mock__';

import { invoice, invoiceLine } from '../../../test/jest/fixtures';
import InvoiceLineForm from './InvoiceLineForm';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('../AdjustmentsForm', () => {
  return () => <span>AdjustmentsForm</span>;
});
jest.mock('./POLineField', () => ({ POLineField: jest.fn(() => 'POLineField') }));

const defaultProps = {
  initialValues: invoiceLine,
  invoice,
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  vendorCode: 'edi',
};
const renderInvoiceLineForm = (props = defaultProps) => render(
  <InvoiceLineForm {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoiceLineForm component', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', () => {
    const { container, asFragment } = renderInvoiceLineForm();

    container.querySelector('#invoice-line-form-accordion-set').removeAttribute('aria-multiselectable');

    expect(asFragment()).toMatchSnapshot();
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
});
