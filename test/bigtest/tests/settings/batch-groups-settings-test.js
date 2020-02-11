import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BatchGroupsSettingsInteractor from '../../interactors/BatchGroupsSettingsInteractor';

describe('Batch groups settings', function () {
  setupApplication();

  const setting = new BatchGroupsSettingsInteractor();

  beforeEach(function () {
    this.visit('/settings/invoice/batch-groups');
  });

  it('should be rendered', () => {
    expect(setting.isPresent).to.be.true;
  });
});
