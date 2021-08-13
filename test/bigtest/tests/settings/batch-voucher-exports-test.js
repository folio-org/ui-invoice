import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from 'miragejs';

import {
  BATCH_VOUCHERS_API,
  BATCH_VOUCHER_EXPORT_STATUS,
} from '../../../../src/common/constants';
import { EXPORT_FORMAT } from '../../../../src/settings/BatchGroupConfigurationSettings/constants';
import setupApplication from '../../helpers/setup-application';
import BatchGroupConfigurationSettingsInteractor from '../../interactors/BatchGroupConfigurationSettingsInteractor';

describe('Batch voucher exports list', function () {
  setupApplication();

  this.timeout(10000);

  const page = new BatchGroupConfigurationSettingsInteractor();
  let batchVoucherExport;

  beforeEach(async function () {
    const batchGroup = this.server.create('batchgroup');

    this.server.create('exportConfig', {
      batchGroupId: batchGroup.id,
      format: EXPORT_FORMAT.json,
    });

    batchVoucherExport = this.server.create('batchvoucherexport', {
      batchGroupId: batchGroup.id,
      status: BATCH_VOUCHER_EXPORT_STATUS.generated,
    });

    this.visit('/settings/invoice/batch-group-configuration');
    await page.whenBatchVoucherExportsLoaded();
  });

  it('shows the list of batch voucher export items', () => {
    expect(page.batchVoucherExports.list().length).to.be.equal(1);
    expect(page.batchVoucherExports.list(0).downloadButton.isPresent).to.be.true;
  });

  describe('download batch vouchers', () => {
    beforeEach(async function () {
      await page.batchVoucherExports.list(0).downloadButton.click();
    });

    it('nothing', () => {
      expect(page.batchVoucherExports.list(0).downloadButton.isPresent).to.be.true;
    });
  });

  describe('download error', () => {
    beforeEach(async function () {
      this.server.get(
        `${BATCH_VOUCHERS_API}/${batchVoucherExport.batchVoucherId}`,
        () => new Response(500, { errors: [{ cause: 'some error' }] }),
      );
      await page.batchVoucherExports.list(0).downloadButton.click();
    });

    it('nothing', () => {
      expect(page.batchVoucherExports.list(0).downloadButton.isPresent).to.be.true;
    });
  });
});
