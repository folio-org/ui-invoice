import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BatchGroupConfigurationSettingsInteractor from '../../interactors/BatchGroupConfigurationSettingsInteractor';

describe('Batch voucher exports list', function () {
  setupApplication();

  const page = new BatchGroupConfigurationSettingsInteractor();

  beforeEach(async function () {
    const batchGroup = this.server.create('batchgroup');

    this.server.create('batchvoucherexport', {
      batchGroupId: batchGroup.id,
    });

    this.visit('/settings/invoice/batch-group-configuration');
    await page.whenBatchVoucherExportsLoaded();
  });

  it('shows the list of batch voucher export items', () => {
    expect(page.batchVoucherExports.list().length).to.be.equal(1);
    expect(page.batchVoucherExports.list(0).downloadButton.isPresent).to.be.true;
  });
});
