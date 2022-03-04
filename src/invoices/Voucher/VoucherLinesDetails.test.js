import React from 'react';
import { render } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { batchVoucherLine } from '../../../test/jest/fixtures';

import VoucherLinesDetails from './VoucherLinesDetails';

const defaultProps = {
  voucherLines: [batchVoucherLine],
  currency: 'USD',
};
const renderVoucherLinesDetails = (props = defaultProps) => render(
  <VoucherLinesDetails {...props} />,
);

describe('VoucherLinesDetails', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { asFragment } = renderVoucherLinesDetails();

    expect(asFragment()).toMatchSnapshot();
  });
});
