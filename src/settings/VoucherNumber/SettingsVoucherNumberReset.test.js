import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import SettingsVoucherNumberReset from './SettingsVoucherNumberReset';

const defaultProps = {
  resources: {
    voucherNumber: {
      records: [{ sequenceNumber: 42 }],
    },
  },
  mutator: {
    sequenceNumber: {
      replace: jest.fn(),
    },
    voucherNumber: {
      POST: jest.fn(),
    },
  },
};

const renderSettingsVoucherNumberReset = (props = {}) => render(
  <SettingsVoucherNumberReset
    {...defaultProps}
    {...props}
  />,
);

describe('SettingsVoucherNumberReset', () => {
  it('should display voucher number reset button', () => {
    renderSettingsVoucherNumberReset();

    expect(screen.getByText('ui-invoice.settings.voucherNumber.reset')).toBeInTheDocument();
  });

  it('should hide reset button in non-interactive format', () => {
    renderSettingsVoucherNumberReset({ isNonInteractive: true });

    expect(screen.queryByText('ui-invoice.settings.voucherNumber.reset')).not.toBeInTheDocument();
  });
});
