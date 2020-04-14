import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import SettingsAdjustmentFormInteractor from '../../interactors/SettingsAdjustmentFormInteractor';

describe('Create new adjustment', function () {
  setupApplication();
  const setting = new SettingsAdjustmentFormInteractor();

  beforeEach(function () {
    this.visit('/settings/invoice/adjustments/create');
  });

  it('should renders adjustment form', () => {
    expect(setting.isPresent).to.be.true;
  });

  describe('Add data and save adjustment', () => {
    beforeEach(async function () {
      await setting.description.fill('test value');
      await setting.formFooter.saveButton.click();
    });

    it('closes form', () => {
      expect(setting.isPresent).to.be.false;
    });
  });
});
