import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
  Paneset,
} from '@folio/stripes/components';

import { adjustment } from '../../../../test/jest/fixtures';

import SettingsAdjustmentsView from './SettingsAdjustmentsView';

const defaultProps = {
  adjustment: {
    metadata: {},
    title: 'adjustment title',
    adjustment,
  },
  close: jest.fn(),
  onDelete: jest.fn(),
  rootPath: '/path',
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
});
