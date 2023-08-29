import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import { HasCommand } from '@folio/stripes/components';

import { adjustment } from '../../../../test/jest/fixtures';

import SettingsAdjustmentsList from './SettingsAdjustmentsList';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));

const defaultProps = {
  label: <span>adjustments</span>,
  adjustments: [adjustment],
  rootPath: '/path',
};
const renderSettingsAdjustmentsList = (props = defaultProps) => render(
  <SettingsAdjustmentsList {...props} />,
  { wrapper: MemoryRouter },
);

describe('SettingsAdjustmentsList', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { asFragment } = renderSettingsAdjustmentsList();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
    });

    it('should navigate to new form when new shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderSettingsAdjustmentsList();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(pushMock).toHaveBeenCalledWith(`${defaultProps.rootPath}/create`);
    });
  });
});
