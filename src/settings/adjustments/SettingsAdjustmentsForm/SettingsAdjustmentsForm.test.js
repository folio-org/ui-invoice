/* Partially generated with AI — Cursor */

import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';

import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_OPTIONS,
  ADJUSTMENT_PRORATE_OPTIONS,
  ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS,
  ADJUSTMENT_RELATION_TO_TOTAL_LABELS,
  ADJUSTMENT_TYPE_VALUES,
  ADJUSTMENT_PRORATE_LABELS,
  ADJUSTMENT_TYPE_LABELS,
} from '../../../common/constants';

import SettingsAdjustmentsForm from './SettingsAdjustmentsForm';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Layer: jest.fn(({ children }) => children),
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewMetaData: jest.fn(() => <div>ViewMetaData</div>),
}));

const defaultProps = {
  close: jest.fn(),
  metadata: null,
  title: 'Test Adjustment',
  onSubmit: jest.fn(),
  initialValues: {},
};

const renderComponent = (props = {}) => render(
  <SettingsAdjustmentsForm
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('SettingsAdjustmentsForm', () => {
  const fillRequiredFields = async () => {
    const descriptionField = screen.getByRole('textbox', { name: 'ui-invoice.settings.adjustments.description' });
    const typeField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.type' });
    const prorateField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.prorate' });
    const relationField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.relationToTotal' });

    await userEvent.type(descriptionField, 'test adjustment');
    await userEvent.selectOptions(typeField, ADJUSTMENT_TYPE_VALUES.percent);
    await userEvent.selectOptions(prorateField, ADJUSTMENT_PRORATE_VALUES.byLine);
    await userEvent.selectOptions(relationField, ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form with all required fields', () => {
      renderComponent();

      expect(screen.getByText('Test Adjustment')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.description')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.type')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.alwaysShow')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.value')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.prorate')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.relationToTotal')).toBeInTheDocument();
      expect(screen.getByText('ui-invoice.settings.adjustments.exportToAccounting')).toBeInTheDocument();
    });

    it('should render metadata when provided', () => {
      const metadata = { createdBy: 'test-user', createdDate: '2023-01-01' };

      renderComponent({ metadata });

      expect(screen.getByText('ViewMetaData')).toBeInTheDocument();
    });

    it('should not render metadata when not provided', () => {
      renderComponent({ metadata: null });

      expect(screen.queryByText('ViewMetaData')).not.toBeInTheDocument();
    });

    it('should render form footer with save button', () => {
      renderComponent();

      expect(screen.getByText('stripes-components.saveAndClose')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should render description field as required', () => {
      renderComponent();

      const descriptionField = screen.getByRole('textbox', { name: 'ui-invoice.settings.adjustments.description' });

      expect(descriptionField).toBeInTheDocument();
      expect(descriptionField).toHaveAttribute('name', 'description');
    });

    it('should render type field with correct options', () => {
      renderComponent();

      const typeField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.type' });

      expect(typeField).toBeInTheDocument();
      expect(typeField).toHaveAttribute('name', 'type');

      // Check that all type options are present
      ADJUSTMENT_TYPE_OPTIONS.forEach(option => {
        expect(screen.getByText(ADJUSTMENT_TYPE_LABELS[option.value])).toBeInTheDocument();
      });
    });

    it('should render prorate field with correct options', () => {
      renderComponent();

      const prorateField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.prorate' });

      expect(prorateField).toBeInTheDocument();
      expect(prorateField).toHaveAttribute('name', 'prorate');

      // Check that all prorate options are present
      ADJUSTMENT_PRORATE_OPTIONS.forEach(option => {
        expect(screen.getByText(ADJUSTMENT_PRORATE_LABELS[option.value])).toBeInTheDocument();
      });
    });

    it('should render relation to total field with correct options', () => {
      renderComponent();

      const relationField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.relationToTotal' });

      expect(relationField).toBeInTheDocument();
      expect(relationField).toHaveAttribute('name', 'relationToTotal');

      // Check that all relation options are present
      ADJUSTMENT_RELATION_TO_TOTAL_OPTIONS.forEach(option => {
        expect(screen.getByText(ADJUSTMENT_RELATION_TO_TOTAL_LABELS[option.value])).toBeInTheDocument();
      });
    });

    it('should render checkbox fields correctly', () => {
      renderComponent();

      const alwaysShowCheckbox = screen.getByRole('checkbox', { name: 'ui-invoice.settings.adjustments.alwaysShow' });
      const exportToAccountingCheckbox = screen.getByRole('checkbox', { name: 'ui-invoice.settings.adjustments.exportToAccounting' });

      expect(alwaysShowCheckbox).toBeInTheDocument();
      expect(exportToAccountingCheckbox).toBeInTheDocument();
    });

    it('should render default amount field as number input', () => {
      renderComponent();

      const defaultAmountField = screen.getByRole('spinbutton', { name: 'ui-invoice.settings.adjustments.value' });

      expect(defaultAmountField).toBeInTheDocument();
      expect(defaultAmountField).toHaveAttribute('name', 'defaultAmount');
      expect(defaultAmountField).toHaveAttribute('type', 'number');
    });
  });

  describe('Form Footer', () => {
    it('should call onSubmit when save button is clicked', async () => {
      renderComponent();

      const saveButton = screen.getByText('stripes-components.saveAndClose');

      await fillRequiredFields();
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalled();
      });
    });

    it('should call close when cancel button is clicked', async () => {
      renderComponent();

      const cancelButton = screen.getByRole('button', { name: /cancel/ });

      await userEvent.click(cancelButton);

      expect(defaultProps.close).toHaveBeenCalled();
    });
  });

  describe('Relation Options Filtering', () => {
    it('should show all relation options when prorate is not "Not prorated"', () => {
      const initialValues = {
        ...defaultProps.initialValues,
        prorate: ADJUSTMENT_PRORATE_VALUES.byLine,
      };

      renderComponent({ initialValues });

      const relationField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.relationToTotal' });
      const options = relationField.querySelectorAll('option');

      // Should have all 3 relation options plus the default "Select..." option
      expect(options).toHaveLength(4);
      expect(
        screen.getByText(ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo]),
      ).toBeInTheDocument();
      expect(
        screen.getByText(ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn]),
      ).toBeInTheDocument();
      expect(
        screen.getByText(ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom]),
      ).toBeInTheDocument();
    });

    it('should show only inAdditionTo option when prorate is "Not prorated"', () => {
      const initialValues = {
        ...defaultProps.initialValues,
        prorate: ADJUSTMENT_PRORATE_VALUES.notProrated,
      };

      renderComponent({ initialValues });

      const relationField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.relationToTotal' });
      const options = relationField.querySelectorAll('option');

      // Should have only inAdditionTo option plus the default "Select..." option
      expect(options).toHaveLength(2);
      expect(
        screen.getByText(ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.inAdditionTo]),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn]),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(ADJUSTMENT_RELATION_TO_TOTAL_LABELS[ADJUSTMENT_RELATION_TO_TOTAL_VALUES.separateFrom]),
      ).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should mark required fields as required', () => {
      renderComponent();

      const descriptionField = screen.getByRole('textbox', { name: 'ui-invoice.settings.adjustments.description' });
      const typeField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.type' });
      const prorateField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.prorate' });
      const relationField = screen.getByRole('combobox', { name: 'ui-invoice.settings.adjustments.relationToTotal' });

      expect(descriptionField).toBeRequired();
      expect(typeField).toBeRequired();
      expect(prorateField).toBeRequired();
      expect(relationField).toBeRequired();
    });

    it('should not mark optional fields as required', () => {
      renderComponent();

      const alwaysShowCheckbox = screen.getByRole('checkbox', { name: 'ui-invoice.settings.adjustments.alwaysShow' });
      const defaultAmountField = screen.getByRole('spinbutton', { name: 'ui-invoice.settings.adjustments.value' });
      const exportToAccountingCheckbox = screen.getByRole('checkbox', { name: 'ui-invoice.settings.adjustments.exportToAccounting' });

      expect(alwaysShowCheckbox).not.toBeRequired();
      expect(defaultAmountField).not.toBeRequired();
      expect(exportToAccountingCheckbox).not.toBeRequired();
    });
  });

  describe('a11y', () => {
    it('should render component without axe errors', async () => {
      renderComponent();

      await runAxeTest({ rootNode: document.body });
    });
  });
});
