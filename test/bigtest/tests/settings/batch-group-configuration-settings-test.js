import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BatchGroupConfigurationSettingsInteractor from '../../interactors/BatchGroupConfigurationSettingsInteractor';

describe('Batch group configuration settings', function () {
  setupApplication();

  const setting = new BatchGroupConfigurationSettingsInteractor();

  beforeEach(function () {
    this.server.create('batchgroup');

    this.visit('/settings/invoice/batch-group-configuration');
  });

  it('should be rendered', () => {
    expect(setting.isPresent).to.be.true;
  });
});
