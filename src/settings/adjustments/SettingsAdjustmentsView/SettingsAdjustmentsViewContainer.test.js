import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { match } from 'fixtures';
import {
  ADJUSTMENT_PRORATE_VALUES,
  ADJUSTMENT_RELATION_TO_TOTAL_VALUES,
  ADJUSTMENT_TYPE_VALUES,
  CONFIG_NAME_ADJUSTMENTS,
} from '../../../common/constants';
import {
  useAdjustmentsSetting,
  useAdjustmentsSettingsMutation,
} from '../../hooks';
import SettingsAdjustmentsView from './SettingsAdjustmentsView';
import SettingsAdjustmentsViewContainer from './SettingsAdjustmentsViewContainer';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAdjustmentsSetting: jest.fn(),
  useAdjustmentsSettingsMutation: jest.fn(),
}));
jest.mock('./SettingsAdjustmentsView', () => jest.fn().mockReturnValue('SettingsAdjustmentsView'));

const defaultProps = {
  rootPath: '/',
  match,
  close: jest.fn(),
  showSuccessDeleteMessage: jest.fn(),
  refetch: jest.fn(),
};
const renderSettingsAdjustmentsViewContainer = (props = {}) => render(
  <SettingsAdjustmentsViewContainer
    {...defaultProps}
    {...props}
  />,
);

const settingStub = {
  id: 'test-id',
  key: CONFIG_NAME_ADJUSTMENTS,
  value: JSON.stringify({
    description: 'Test Description',
    amount: 100,
    prorate: ADJUSTMENT_PRORATE_VALUES.byAmount,
    relationToTotal: ADJUSTMENT_RELATION_TO_TOTAL_VALUES.includedIn,
    type: ADJUSTMENT_TYPE_VALUES.amount,
  }),
};

const deleteSettingMock = jest.fn(() => Promise.resolve());

describe('SettingsAdjustmentsViewContainer', () => {
  beforeEach(() => {
    useAdjustmentsSetting.mockReturnValue({ setting: settingStub });
    useAdjustmentsSettingsMutation.mockReturnValue({ deleteSetting: deleteSettingMock });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display SettingsAdjustmentsView', () => {
    renderSettingsAdjustmentsViewContainer();

    expect(screen.getByText('SettingsAdjustmentsView')).toBeDefined();
  });

  describe('Actions', () => {
    it('should make Delete request when delete adjustment (onDelete) action is called', async () => {
      renderSettingsAdjustmentsViewContainer();

      await act(async () => {
        await SettingsAdjustmentsView.mock.calls[0][0].onDelete();
      });

      expect(deleteSettingMock).toHaveBeenCalled();
      expect(defaultProps.refetch).toHaveBeenCalled();
    });

    it('should close view when adjustment has been deleted', async () => {
      renderSettingsAdjustmentsViewContainer();

      await act(async () => {
        await SettingsAdjustmentsView.mock.calls[0][0].onDelete();
      });

      expect(defaultProps.close).toHaveBeenCalled();
    });

    it('should show success message when adjustment has been deleted', async () => {
      renderSettingsAdjustmentsViewContainer();

      await act(async () => {
        await SettingsAdjustmentsView.mock.calls[0][0].onDelete();
      });

      expect(defaultProps.showSuccessDeleteMessage).toHaveBeenCalled();
    });

    it('should not close view when adjustment has not been deleted', async () => {
      deleteSettingMock.mockImplementation(() => Promise.reject());

      renderSettingsAdjustmentsViewContainer();

      await act(async () => {
        await SettingsAdjustmentsView.mock.calls[0][0].onDelete();
      });

      expect(defaultProps.close).not.toHaveBeenCalled();
    });
  });
});
