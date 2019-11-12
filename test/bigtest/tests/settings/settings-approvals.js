import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import SettingsApprovalsInteractor from '../../interactors/SettingsApprovalsInteractor';

describe('Setting of invoice approvals', function () {
  setupApplication();
  const setting = new SettingsApprovalsInteractor();

  beforeEach(function () {
    this.visit('/settings/invoice/approvals');
  });

  it('should be displayed', () => {
    expect(setting.isPresent).to.be.true;
  });
});
