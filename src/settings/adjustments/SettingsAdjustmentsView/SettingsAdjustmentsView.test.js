import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
  Paneset,
  HasCommand,
} from '@folio/stripes/components';

import { adjustment, history } from '../../../../test/jest/fixtures';

import SettingsAdjustmentsView from './SettingsAdjustmentsView';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-components/lib/NoValue', () => {
  return () => <span>-</span>;
});

const mockPush = jest.fn();
const defaultProps = {
  adjustment: {
    metadata: {},
    title: 'adjustment title',
    adjustment,
  },
  close: jest.fn(),
  onDelete: jest.fn(),
  rootPath: '/path',
  history: { ...history, push: mockPush },
  stripes: { hasPerm: jest.fn().mockReturnValue(true) },
};
const renderSettingsAdjustmentsView = (props = defaultProps) => render(
  <Paneset>
    <SettingsAdjustmentsView {...props} />
  </Paneset>,
  { wrapper: MemoryRouter },
);

describe('SettingsAdjustmentsView', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { asFragment } = renderSettingsAdjustmentsView();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Actions', () => {
    it('should open confirmation modal when delete action is pressed', () => {
      renderSettingsAdjustmentsView();

      user.click(screen.getByTestId('adjustment-delete'));

      expect(screen.getByText('ui-invoice.settings.adjustments.confirmDelete.message')).toBeDefined();
    });

    it('should call onDelete prop when delete is confirmed', () => {
      const onDelete = jest.fn();

      renderSettingsAdjustmentsView({ ...defaultProps, onDelete });

      user.click(screen.getByTestId('adjustment-delete'));
      user.click(screen.getByText('ui-invoice.settings.adjustments.confirmDelete.confirmLabel'));

      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe('SettingsAdjustmentsView shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      defaultProps.close.mockClear();
    });

    it('should call close when cancel shortcut is called', () => {
      renderSettingsAdjustmentsView();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.close).toHaveBeenCalled();
    });

    it('should navigate to edit form when edit shortcut is called', () => {
      mockPush.mockClear();

      renderSettingsAdjustmentsView();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(mockPush).toHaveBeenCalledWith(`${defaultProps.rootPath}/${defaultProps.adjustment.id}/edit`);
    });
  });
});
