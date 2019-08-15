import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import SettingsVoucherNumberInteractor from '../../interactors/SettingsVoucherNumberInteractor';

describe('Setting of Order Approvals', function () {
  setupApplication();

  const setting = new SettingsVoucherNumberInteractor();

  beforeEach(function () {
    this.visit('/settings/invoice/voucher-number');
  });

  it('renders', () => {
    expect(setting.isPresent).to.be.true;
  });
});
