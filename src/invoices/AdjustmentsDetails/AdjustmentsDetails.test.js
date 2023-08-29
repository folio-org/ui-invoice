import { render } from '@folio/jest-config-stripes/testing-library/react';

import { adjustment } from '../../../test/jest/fixtures';
import { ADJUSTMENT_TYPE_VALUES } from '../../common/constants';
import AdjustmentsDetails from './AdjustmentsDetails';

const renderAdjustmentsDetails = (props) => (render(
  <AdjustmentsDetails {...props} />,
));

describe('AdjustmentsDetails', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should display adjustments table', () => {
    const { asFragment } = renderAdjustmentsDetails({
      currency: 'USD',
      adjustments: [adjustment, { ...adjustment, type: ADJUSTMENT_TYPE_VALUES.percent }],
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
