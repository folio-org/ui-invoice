import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import BatchGroupsSettingsInteractor from '../../interactors/BatchGroupsSettingsInteractor';

describe('Batch groups settings', function () {
  setupApplication();

  const setting = new BatchGroupsSettingsInteractor();
  const deleteConfirmation = new ConfirmationInteractor('#delete-controlled-vocab-entry-confirmation');

  beforeEach(function () {
    this.visit('/settings/invoice/batch-groups');
  });

  it('should be rendered', () => {
    expect(setting.isPresent).to.be.true;
    expect(setting.batchGroups.isPresent).to.be.false;
  });

  describe('Add new group', function () {
    beforeEach(async function () {
      await setting.newButton.click();
    });

    it('renders fields for new group', () => {
      expect(setting.batchGroups.list(0).saveButton.isPresent).to.be.true;
      expect(setting.batchGroups.list(0).cancelButton.isPresent).to.be.true;
    });

    describe('Cancel add new group', function () {
      beforeEach(async function () {
        await setting.batchGroups.list(0).cancelButton.click();
      });

      it('renders fields for new group', () => {
        expect(setting.batchGroups.isPresent).to.be.false;
      });
    });

    describe('Save new group', function () {
      beforeEach(async function () {
        await setting.batchGroups.list(0).nameInput.fill('test');
        await setting.batchGroups.list(0).saveButton.click();
      });

      it('renders saved group', () => {
        expect(setting.batchGroups.list().length).to.equal(1);
      });

      describe('Edit group', function () {
        beforeEach(async function () {
          await setting.batchGroups.list(0).editButton.click();
          await setting.batchGroups.list(0).nameInput.fill('test new');
          await setting.batchGroups.list(0).saveButton.click();
        });

        it('renders edited group', () => {
          expect(setting.batchGroups.list().length).to.equal(1);
        });
      });

      describe('Delete group', function () {
        beforeEach(async function () {
          await setting.batchGroups.list(0).deleteButton.click();
          await deleteConfirmation.confirm();
        });

        it('doesnt render empty list', () => {
          expect(setting.batchGroups.isPresent).to.be.false;
        });
      });
    });
  });
});
