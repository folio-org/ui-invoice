import { render } from '@folio/jest-config-stripes/testing-library/react';

import StatusValue from './StatusValue';

jest.mock('../../utils', () => ({
  getInvoiceStatusLabel: jest.fn().mockReturnValue('getInvoiceStatusLabel util'),
}));

const renderStatusValue = (props) => (render(
  <StatusValue {...props} />,
));

describe('StatusValue', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should display status value', () => {
    const { asFragment } = renderStatusValue({ value: 'Approved' });

    expect(asFragment()).toMatchSnapshot();
  });
});
