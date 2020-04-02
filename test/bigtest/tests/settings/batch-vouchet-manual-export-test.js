import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BatchGroupConfigurationSettingsInteractor from '../../interactors/BatchGroupConfigurationSettingsInteractor';

describe('Batch group manual voucher export', function () {
  setupApplication();

  const setting = new BatchGroupConfigurationSettingsInteractor();

  beforeEach(async function () {
    const batchGroup = this.server.create('batchgroup');

    this.server.create('exportConfig', {
      batchGroupId: batchGroup.id,
    });

    this.server.create('batchvoucherexport', {
      batchGroupId: batchGroup.id,
    });

    this.visit('/settings/invoice/batch-group-configuration');
    await setting.whenBatchVoucherExportsLoaded();
    await setting.runManualExportButton.click();
  });

  it('displays run manual export confirmation modal', () => {
    expect(setting.manualExportConfirmation.isPresent).to.be.true;
  });

  describe('Confirm run manual export', () => {
    beforeEach(async function () {
      await setting.manualExportConfirmation.confirm();
    });

    it('Confirmation modal is closed', () => {
      expect(setting.manualExportConfirmation.isPresent).to.be.false;
    });
  });
});
