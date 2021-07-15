import React from 'react';
import { render } from '@testing-library/react';

import { ApprovedBy } from './ApprovedBy';

jest.mock('../../utils', () => ({
  getUserName: jest.fn().mockReturnValue('getUserName util'),
}));

const renderApprovedBy = (props) => (render(
  <ApprovedBy {...props} />,
));

describe('ApprovedBy', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should display no value when no approved', () => {
    const { asFragment } = renderApprovedBy({ approvedByUserId: undefined, resources: {} });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display user full name when approver defined', () => {
    const { asFragment } = renderApprovedBy({
      approvedByUserId: 'approvedByUserId',
      resources: {
        approvedByUser: { records: [{ firstName: 'Mark' }] },
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
