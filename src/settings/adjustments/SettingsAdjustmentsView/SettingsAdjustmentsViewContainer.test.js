import React from 'react';
import { render, screen } from '@testing-library/react';

import { match } from '../../../../test/jest/fixtures';

import SettingsAdjustmentsView from './SettingsAdjustmentsView';
import SettingsAdjustmentsViewContainer from './SettingsAdjustmentsViewContainer';

jest.mock('./SettingsAdjustmentsView', () => jest.fn().mockReturnValue('SettingsAdjustmentsView'));

const mutatorMock = {
  configAdjustment: {
    GET: jest.fn(() => Promise.resolve({})),
    DELETE: jest.fn(() => Promise.resolve()),
  },
};
const defaultProps = {
  rootPath: '/',
  match,
  close: jest.fn(),
  showSuccessDeleteMessage: jest.fn(),
  mutator: mutatorMock,
};
const renderSettingsAdjustmentsViewContainer = (props = defaultProps) => render(
  <SettingsAdjustmentsViewContainer {...props} />,
);

describe('SettingsAdjustmentsViewContainer', () => {
  beforeEach(() => {
    SettingsAdjustmentsView.mockClear();
  });

  it('should display SettingsAdjustmentsView', () => {
    renderSettingsAdjustmentsViewContainer();

    expect(screen.getByText('SettingsAdjustmentsView')).toBeDefined();
  });

  it('should fetch adjustment', () => {
    const mutator = { configAdjustment: { GET: jest.fn(() => Promise.reject()) } };

    renderSettingsAdjustmentsViewContainer({
      ...defaultProps,
      mutator,
    });

    expect(mutator.configAdjustment.GET).toHaveBeenCalled();
  });

  describe('Actions', () => {
    it('should make Delete request when delete adjustment (onDelete) action is called', () => {
      renderSettingsAdjustmentsViewContainer();

      SettingsAdjustmentsView.mock.calls[0][0].onDelete();

      expect(mutatorMock.configAdjustment.DELETE).toHaveBeenCalled();
    });

    it('should close view when adjustment has been deleted', async () => {
      const close = jest.fn();

      renderSettingsAdjustmentsViewContainer({ ...defaultProps, close });

      await SettingsAdjustmentsView.mock.calls[0][0].onDelete();

      expect(close).toHaveBeenCalled();
    });

    it('should show success message when adjustment has been deleted', async () => {
      const showSuccessDeleteMessage = jest.fn();

      renderSettingsAdjustmentsViewContainer({ ...defaultProps, showSuccessDeleteMessage });

      await SettingsAdjustmentsView.mock.calls[0][0].onDelete();

      expect(showSuccessDeleteMessage).toHaveBeenCalled();
    });

    it('should not close view when adjustment has not been deleted', async () => {
      const close = jest.fn();

      mutatorMock.configAdjustment.DELETE.mockClear().mockImplementation(() => Promise.reject());
      renderSettingsAdjustmentsViewContainer({ ...defaultProps, close });

      await SettingsAdjustmentsView.mock.calls[0][0].onDelete();

      expect(close).not.toHaveBeenCalled();
    });
  });
});
