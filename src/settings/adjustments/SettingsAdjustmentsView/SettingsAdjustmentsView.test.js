import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
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
  it('should render correct structure', async () => {
    const { asFragment } = renderSettingsAdjustmentsView();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Actions', () => {
    it('should open confirmation modal when delete action is pressed', async () => {
      renderSettingsAdjustmentsView();

      await user.click(screen.getByTestId('adjustment-delete'));

      expect(screen.getByText('ui-invoice.settings.adjustments.confirmDelete.message')).toBeDefined();
    });

    it('should call onDelete prop when delete is confirmed', async () => {
      const onDelete = jest.fn();

      renderSettingsAdjustmentsView({ ...defaultProps, onDelete });

      await user.click(screen.getByTestId('adjustment-delete'));
      await user.click(screen.getByText('ui-invoice.settings.adjustments.confirmDelete.confirmLabel'));

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
