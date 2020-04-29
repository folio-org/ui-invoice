import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import {
  CONFIG_MODULE_INVOICE,
  CONFIG_NAME_ADJUSTMENTS,
} from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import SettingsAdjustmentsDetailsInteractor from '../../interactors/SettingsAdjustmentDetailsInteractor';
import SettingsAdjustmentsListInteractor from '../../interactors/SettingsAdjustmentsListInteractor';
import { adjustmentConfig } from '../InvoiceCreate/InvoiceCreate-test';

describe('Delete adjustment', function () {
  setupApplication();
  const setting = new SettingsAdjustmentsDetailsInteractor();
  const settingList = new SettingsAdjustmentsListInteractor();

  beforeEach(async function () {
    const adjustment = this.server.create('config', {
      module: CONFIG_MODULE_INVOICE,
      configName: CONFIG_NAME_ADJUSTMENTS,
      enabled: true,
      value: adjustmentConfig,
    });

    this.visit('/settings/invoice/adjustments');
    await settingList.whenLoaded();
    this.visit(`/settings/invoice/adjustments/${adjustment.id}/view`);
    await setting.whenLoaded();
  });

  it('should renders adjustment details', () => {
    expect(setting.isPresent).to.be.true;
  });

  describe('click delete invoice line', () => {
    const deleteConfirmation = new ConfirmationInteractor('#delete-adjustment-modal');

    beforeEach(async function () {
      await setting.actions.delete.click();
    });

    it('shows delete adjustment confirmation', () => {
      expect(deleteConfirmation.isVisible).to.be.true;
    });
  });

  describe('click delete', () => {
    const deleteConfirmation = new ConfirmationInteractor('#delete-adjustment-modal');

    beforeEach(async function () {
      await setting.actions.delete.click();
      await deleteConfirmation.confirm();
      await settingList.whenLoaded();
    });

    it('closes delete order confirmation', () => {
      expect(deleteConfirmation.isPresent).to.be.false;
    });

    it('shows adjustments list', () => {
      expect(settingList.isPresent).to.be.true;
    });
  });
});
