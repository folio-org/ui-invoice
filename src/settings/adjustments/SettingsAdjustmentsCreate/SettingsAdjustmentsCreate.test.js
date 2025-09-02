/* Partially generated with AI — Cursor */

import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useShowCallout } from '@folio/stripes-acq-components';
import { runAxeTest } from '@folio/stripes-testing';

import { CONFIG_NAME_ADJUSTMENTS } from '../../../common/constants';
import { useAdjustmentsSettingsMutation } from '../../hooks';
import { SettingsAdjustmentsCreate } from './SettingsAdjustmentsCreate';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewMetaData: jest.fn(() => <div>ViewMetaData</div>),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Layer: jest.fn(({ children }) => children),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
  handleKeyCommand: jest.fn((fn) => fn),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAdjustmentsSettingsMutation: jest.fn(),
}));

const defaultProps = {
  onClose: jest.fn(),
  refetch: jest.fn(),
};

const mockUpsertSetting = jest.fn();
const showCalloutMock = jest.fn();

const renderComponent = (props = {}) => render(
  <SettingsAdjustmentsCreate
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('SettingsAdjustmentsCreate', () => {
  const fillRequiredFields = async () => {
    const descriptionField = screen.getByRole('textbox', { name: 'ui-invoice.settings.adjustments.description' });
    const typeField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.type' });
    const prorateField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.prorate' });
    const relationField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.relationToTotal' });

    await act(async () => {
      await userEvent.clear(descriptionField);
      await userEvent.type(descriptionField, 'test adjustment');
      await userEvent.selectOptions(typeField, 'Amount');
      await userEvent.selectOptions(prorateField, 'Not prorated');
      await userEvent.selectOptions(relationField, 'In addition to');
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAdjustmentsSettingsMutation.mockReturnValue({
      upsertSetting: mockUpsertSetting,
    });

    useShowCallout.mockReturnValue(showCalloutMock);
  });

  describe('Rendering', () => {
    it('should render the component with correct title', () => {
      renderComponent();

      expect(screen.getByText('ui-invoice.settings.adjustments.title.new')).toBeInTheDocument();
    });

    it('should render SettingsAdjustmentsForm', () => {
      renderComponent();

      expect(screen.getByText('ui-invoice.settings.adjustments.description')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.type')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call upsertSetting with correct data when form is submitted', async () => {
      mockUpsertSetting.mockResolvedValueOnce({});

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockUpsertSetting).toHaveBeenCalledWith({
          data: {
            key: CONFIG_NAME_ADJUSTMENTS,
            value: expect.any(String),
          },
        });
      });
    });

    it('should call refetch after successful submission', async () => {
      mockUpsertSetting.mockResolvedValueOnce({});

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(defaultProps.refetch).toHaveBeenCalled();
      });
    });

    it('should call onClose after successful submission', async () => {
      mockUpsertSetting.mockResolvedValueOnce({});

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('should show success callout after successful submission', async () => {
      mockUpsertSetting.mockResolvedValueOnce({});

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(showCalloutMock).toHaveBeenCalled();
      });
    });

    it('should show error callout when submission fails', async () => {
      const error = new Error('API Error');

      mockUpsertSetting.mockRejectedValueOnce(error);

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(showCalloutMock).toHaveBeenCalled();
      });
    });

    it('should not call refetch or onClose when submission fails', async () => {
      const error = new Error('API Error');

      mockUpsertSetting.mockRejectedValueOnce(error);

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(defaultProps.refetch).not.toHaveBeenCalled();
        expect(defaultProps.onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Form Close', () => {
    it('should call onClose when cancel button is clicked', async () => {
      renderComponent();

      const cancelButton = screen.getByRole('button', { name: /cancel/ });

      await act(async () => {
        await userEvent.click(cancelButton);
      });

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('a11y', () => {
    it('should render component without axe errors', async () => {
      renderComponent();

      await runAxeTest({ rootNode: document.body });
    });
  });
});
