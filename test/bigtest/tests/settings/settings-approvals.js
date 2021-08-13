import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import SettingsApprovalsInteractor from '../../interactors/SettingsApprovalsInteractor';

describe('Setting of invoice approvals', function () {
  setupApplication();

  this.timeout(10000);

  const setting = new SettingsApprovalsInteractor();

  beforeEach(function () {
    this.visit('/settings/invoice/approvals');
  });

  it('should be displayed', () => {
    expect(setting.isPresent).to.be.true;
  });
});
