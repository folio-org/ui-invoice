import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { adjustment } from '../../../../test/jest/fixtures';

import SettingsAdjustmentsList from './SettingsAdjustmentsList';

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
});
