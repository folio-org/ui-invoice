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

import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
} from '../../../common/constants';
import {
  useAdjustmentsSetting,
  useAdjustmentsSettingsMutation,
} from '../../hooks';
import { SettingsAdjustmentsEdit } from './SettingsAdjustmentsEdit';

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
  useAdjustmentsSetting: jest.fn(),
  useAdjustmentsSettingsMutation: jest.fn(),
}));

const adjustmentStub = {
  description: 'test adjustment',
  prorate: ADJUSTMENT_PRORATE_VALUES.notProrated,
  relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo,
  type: ADJUSTMENT_TYPE_VALUES.amount,
};

const defaultProps = {
  onClose: jest.fn(),
  refetch: jest.fn(),
};

const mockUpdateSetting = jest.fn();
const showCalloutMock = jest.fn();

const renderComponent = (props = {}) => render(
  <SettingsAdjustmentsEdit
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('SettingsAdjustmentsEdit', () => {
  const fillRequiredFields = async () => {
    const descriptionField = screen.getByRole('textbox', { name: 'ui-invoice.settings.adjustments.description' });
    const typeField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.type' });
    const prorateField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.prorate' });
    const relationField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.relationToTotal' });

    await act(async () => {
      await userEvent.clear(descriptionField);
      await userEvent.type(descriptionField, 'test adjustment');
      await userEvent.selectOptions(typeField, ADJUSTMENT_TYPE_VALUES.percent);
      await userEvent.selectOptions(prorateField, ADJUSTMENT_PRORATE_VALUES.byQuantity);
      await userEvent.selectOptions(relationField, ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom);
    });
  };

  beforeEach(() => {
    useAdjustmentsSetting.mockReturnValue({ adjustmentPreset: adjustmentStub });

    useAdjustmentsSettingsMutation.mockReturnValue({
      updateSetting: mockUpdateSetting,
    });

    useShowCallout.mockReturnValue(showCalloutMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with correct title', () => {
      renderComponent();

      expect(screen.getByText(adjustmentStub.description)).toBeInTheDocument();
    });

    it('should render SettingsAdjustmentsForm', () => {
      renderComponent();

      expect(screen.getByText('ui-invoice.settings.adjustments.description')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.type')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call upsertSetting with correct data when form is submitted', async () => {
      mockUpdateSetting.mockResolvedValueOnce({});

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockUpdateSetting.mock.calls[0][0].data).toEqual({
          ...adjustmentStub,
          description: 'test adjustment',
          prorate: ADJUSTMENT_PRORATE_VALUES.byQuantity,
          relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom,
          type: ADJUSTMENT_TYPE_VALUES.percent,
        });
        expect(defaultProps.refetch).toHaveBeenCalled();
        expect(defaultProps.onClose).toHaveBeenCalled();
        expect(showCalloutMock).toHaveBeenCalled();
      });
    });

    it('should show error callout when submission fails', async () => {
      const error = new Error('API Error');

      mockUpdateSetting.mockRejectedValueOnce(error);

      renderComponent();

      await fillRequiredFields();

      const submitButton = screen.getByText('stripes-components.saveAndClose');

      await act(async () => {
        await userEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(showCalloutMock).toHaveBeenCalled();
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
