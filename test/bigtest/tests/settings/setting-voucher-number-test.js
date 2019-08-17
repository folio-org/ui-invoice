import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import SettingsVoucherNumberInteractor from '../../interactors/SettingsVoucherNumberInteractor';

describe('Setting of Voucher Number', function () {
  setupApplication();

  const setting = new SettingsVoucherNumberInteractor();

  beforeEach(function () {
    this.visit('/settings/invoice/voucher-number');
  });

  it('renders', () => {
    expect(setting.isPresent).to.be.true;
  });

  it('reset button should be visible', () => {
    expect(setting.resetButton.isPresent).to.be.true;
  });

  it('first number should be 10', () => {
    expect(setting.startValue).to.be.equal('10');
  });

  describe('Setting of Voucher Number', function () {
    beforeEach(async function () {
      await setting.resetButton.click();
    });

    it('first number should be 10', () => {
      expect(setting.startValue).to.be.equal('10');
    });
  });
});
