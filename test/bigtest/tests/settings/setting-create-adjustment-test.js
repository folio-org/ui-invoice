import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import SettingsAdjustmentFormInteractor from '../../interactors/SettingsAdjustmentFormInteractor';
import SettingsAdjustmentsListInteractor from '../../interactors/SettingsAdjustmentsListInteractor';

describe('Create new adjustment', function () {
  setupApplication();
  const setting = new SettingsAdjustmentFormInteractor();
  const settingList = new SettingsAdjustmentsListInteractor();

  beforeEach(async function () {
    this.visit('/settings/invoice/adjustments');
    await settingList.whenLoaded();
    this.visit('/settings/invoice/adjustments/create');
    await setting.whenLoaded();
  });

  it('should renders adjustment form', () => {
    expect(setting.isPresent).to.be.true;
  });

  describe('Add data and save adjustment', () => {
    beforeEach(async function () {
      await setting.description.fill('test value');
      await setting.formFooter.saveButton.click();
      await settingList.whenLoaded();
    });

    it('closes form', () => {
      expect(settingList.isPresent).to.be.true;
    });
  });
});
