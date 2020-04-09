import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from 'miragejs';

import { EXPORT_CONFIGURATIONS_API } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import BatchGroupConfigurationSettingsInteractor from '../../interactors/BatchGroupConfigurationSettingsInteractor';

describe('Test connection', function () {
  setupApplication();

  const page = new BatchGroupConfigurationSettingsInteractor();

  beforeEach(async function () {
    const group = this.server.create('batchgroup');
    const config = this.server.create('exportConfig', {
      batchGroupId: group.id,
      uploadURI: 'ftp://ftp.ci.folio.org/',
    });

    this.server.create('credential', {
      exportConfigId: config.id,
      username: 'test',
      password: 'test',
    });
    this.visit('/settings/invoice/batch-group-configuration');
    await page.whenCredsAreLoaded();
  });

  it('should render enabled test connection button', () => {
    expect(page.testConnectionBtn.isPresent).to.be.true;
    expect(page.testConnectionBtn.isDisabled).to.be.false;
  });

  describe('Click test connection', () => {
    beforeEach(async function () {
      await page.testConnectionBtn.click();
    });

    it('nothing', () => {
      expect(page.testConnectionBtn.isPresent).to.be.true;
    });
  });

  describe('Click test connection with error response', () => {
    beforeEach(async function () {
      this.server.post(
        `${EXPORT_CONFIGURATIONS_API}/:id/credentials/test`,
        () => new Response(500, { errors: [{ cause: 'some error' }] }),
      );
      await page.testConnectionBtn.click();
    });

    it('nothing', () => {
      expect(page.testConnectionBtn.isPresent).to.be.true;
    });
  });
});
