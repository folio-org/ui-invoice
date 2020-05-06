import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import { BatchGroupConfigurationSettingsInteractor } from '../../interactors';

describe('Batch group manual voucher export', function () {
  setupApplication();

  const setting = new BatchGroupConfigurationSettingsInteractor();

  beforeEach(async function () {
    const batchGroup = this.server.create('batchgroup');

    this.server.create('exportConfig', {
      batchGroupId: batchGroup.id,
    });

    this.visit('/settings/invoice/batch-group-configuration');
    await setting.runManualExportButton.click();
  });

  it('displays run manual export confirmation modal', () => {
    expect(setting.manualExportConfirmation.isPresent).to.be.true;
    expect(setting.batchVoucherExports.list().length).to.equal(0);
  });

  describe('Confirm run manual export', () => {
    beforeEach(async function () {
      await setting.manualExportConfirmation.confirm();
      await setting.whenBatchVoucherExportsLoaded();
    });

    it('Confirmation modal is closed and row is added', () => {
      expect(setting.manualExportConfirmation.isPresent).to.be.false;
      expect(setting.batchVoucherExports.list().length).to.equal(1);
      expect(setting.batchVoucherExports.list(0).rowText).to.contain('Pending');
    });

    describe('Status is changed on the back-end', () => {
      beforeEach(async function () {
        const record = this.server.schema.batchvoucherexports.first();

        record.update({ status: 'Error' });
        await setting.whenBatchVoucherExportsLoaded();
      });

      it('shows updated status (Error)', () => {
        expect(setting.batchVoucherExports.list().length).to.equal(1);
        expect(setting.batchVoucherExports.list(0).rowText).to.contain('Error');
        console.log(setting.batchVoucherExports.list(0).rowText);
      }).timeout(5000);
    });
  });
});
