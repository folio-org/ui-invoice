import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_ADJUSTMENTS,
} from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import SettingsAdjustmentsListInteractor from '../../interactors/SettingsAdjustmentsListInteractor';
import SettingAdjustmentDetailsInteractor from '../../interactors/SettingsAdjustmentDetailsInteractor';
import SettingAdjustmentFormInteractor from '../../interactors/SettingsAdjustmentFormInteractor';
import { adjustmentConfig } from '../InvoiceCreate/InvoiceCreate-test';

describe('Adjustments list', function () {
  setupApplication();

  this.timeout(10000);

  const setting = new SettingsAdjustmentsListInteractor();
  const details = new SettingAdjustmentDetailsInteractor();
  const form = new SettingAdjustmentFormInteractor();

  beforeEach(async function () {
    this.server.create('config', {
      module: CONFIG_MODULE_INVOICE,
      configName: CONFIG_NAME_ADJUSTMENTS,
      enabled: true,
      value: adjustmentConfig,
    });

    this.visit('/settings/invoice/adjustments');
    await setting.whenLoaded();
  });

  it('should renders adjustments list', () => {
    expect(setting.isPresent).to.be.true;
  });

  describe('view adjustment details', () => {
    beforeEach(async function () {
      await setting.list(0).click();
      await details.whenLoaded();
    });

    it('shows adjustment details', () => {
      expect(details.isPresent).to.be.true;
    });
  });

  describe('create new adjustment', () => {
    beforeEach(async function () {
      await setting.newButton.click();
      await form.whenLoaded();
    });

    it('shows new adjustment form', () => {
      expect(form.isPresent).to.be.true;
    });
  });
});
