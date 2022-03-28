import React from 'react';
import { render } from '@testing-library/react';

import VoucherExport from './VoucherExport';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
  useLocation: jest.fn().mockReturnValue({}),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));

const renderVoucherExport = () => render(
  <VoucherExport />,
);

describe('VoucherExport', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure for voucher export', () => {
    const { asFragment } = renderVoucherExport();

    expect(asFragment()).toMatchSnapshot();
  });
});
