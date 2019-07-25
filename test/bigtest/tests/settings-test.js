import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SettingsInteractor from '../interactors/settings';

describe('Settings', () => {
  const settings = new SettingsInteractor();

  setupApplication();

  describe('adjustments', () => {
    beforeEach(function () {
      this.visit('/settings/invoice/adjustments');
    });

    it('has a adjustments settings message', () => {
      expect(settings.adjustments).to.contain('Adjustments');
    });
  });
});
