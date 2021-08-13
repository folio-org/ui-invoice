import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  SCHEDULE_EXPORT,
} from '../../../../src/settings/BatchGroupConfigurationSettings/constants';
import setupApplication from '../../helpers/setup-application';
import BatchGroupConfigurationSettingsInteractor from '../../interactors/BatchGroupConfigurationSettingsInteractor';

const validFTP = 'ftp://ftp.example.com/';
const invalidFTP = 'ftp.example.com';
const FTPvalidationMessage = 'Invalid upload URI';

describe('Batch group configuration settings', function () {
  setupApplication();

  this.timeout(10000);

  const setting = new BatchGroupConfigurationSettingsInteractor();

  beforeEach(async function () {
    this.server.create('batchgroup');
    this.visit('/settings/invoice/batch-group-configuration');

    await setting.whenCredsAreLoaded();
  });

  it('should render batch group value and export config form', () => {
    expect(setting.isPresent).to.be.true;
    expect(setting.batchGroup).to.be.true;
    expect(setting.batchGroupSelect).to.be.false;
    expect(setting.saveButton.isDisabled).to.be.true;
    expect(setting.runManualExportButton.isDisabled).to.be.true;
    expect(setting.testConnectionBtn.isDisabled).to.be.true;
  });

  describe('select daily schedule export', () => {
    beforeEach(async function () {
      await setting.scheduleExport.select('Daily');
    });

    it('start time field should be present', () => {
      expect(setting.scheduleExport.value).to.be.equal(SCHEDULE_EXPORT.daily);
      expect(setting.startTime.isPresent).to.be.true;
      expect(setting.weekdays).to.be.false;
    });
  });

  describe('select weekly schedule export', () => {
    beforeEach(async function () {
      await setting.scheduleExport.select('Weekly');
    });

    it('start time and weekdays fields should be present', () => {
      expect(setting.scheduleExport.value).to.be.equal(SCHEDULE_EXPORT.weekly);
      expect(setting.weekdays).to.be.true;
      expect(setting.startTime.isPresent).to.be.true;
    });
  });

  describe('Unselect schedule export', () => {
    beforeEach(async function () {
      await setting.scheduleExport.select('');
    });

    it('should hide weekdays and start time fields', () => {
      expect(setting.weekdays).to.be.false;
      expect(setting.startTime.isPresent).to.be.false;
    });
  });

  describe('Upload location field validation', () => {
    beforeEach(async function () {
      await setting.uploadURI.fill(invalidFTP);
      await setting.format.select('JSON');
      await setting.saveButton.click();
    });

    it('validation message should be present', () => {
      expect(setting.validationMessage).to.include(FTPvalidationMessage);
    });
  });

  describe('save export configuration', () => {
    beforeEach(async function () {
      await setting.scheduleExport.select('Daily');
      await setting.startTime.fill('12:00 AM');
      await setting.uploadURI.fill(validFTP);
      await setting.format.select('JSON');
      await setting.saveButton.click();
    });

    it('save export configuration form', () => {
      expect(setting.isPresent).to.be.true;
      expect(setting.saveButton.isDisabled).to.be.true;
    });
  });
});
