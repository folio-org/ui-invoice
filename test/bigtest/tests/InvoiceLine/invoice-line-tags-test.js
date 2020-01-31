import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceLineDetailsInteractor from '../../interactors/InvoiceLineDetailsInteractor';
import InvoiceLineDetailsTags from '../../interactors/InvoiceLineDetailsTags';

const tags = ['tag1', 'tag2'];

describe('Invoice line details tags', () => {
  setupApplication();

  const invoiceLineDetails = new InvoiceLineDetailsInteractor();
  const tagsPane = new InvoiceLineDetailsTags();

  beforeEach(async function () {
    const invoice = this.server.create('invoice');

    this.server.create('vendor', {
      id: invoice.vendorId,
    });

    const invoiceLine = this.server.create('invoiceline', {
      invoiceId: invoice.id,
      tags: {
        tagList: tags,
      },
    });

    this.visit(`/invoice/view/${invoice.id}/line/${invoiceLine.id}/view`);
    await invoiceLineDetails.whenLoaded();
  });

  it('should be displayed', () => {
    expect(invoiceLineDetails.tagsAction.isPresent).to.be.true;
  });

  it('should display tags count', () => {
    expect(invoiceLineDetails.tagsAction.count).to.equal(tags.length.toString());
  });

  describe('click action', () => {
    beforeEach(async function () {
      await invoiceLineDetails.tagsAction.click();
      await tagsPane.whenLoaded();
    });

    it('should open tags pane', () => {
      expect(tagsPane.isPresent).to.be.true;
    });

    describe('close tags pane', () => {
      beforeEach(async function () {
        await tagsPane.closeButton.click();
      });

      it('should close tags pane', () => {
        expect(tagsPane.isPresent).to.be.false;
      });
    });
  });

  describe('delete tag from the list', () => {
    beforeEach(async function () {
      await invoiceLineDetails.tagsAction.click();
      await tagsPane.whenLoaded();
      await tagsPane.selectedTags.list(0).deleteTag();
    });

    it('should delete one tag', () => {
      expect(invoiceLineDetails.tagsAction.count).to.equal((tags.length - 1).toString());
    });
  });

  describe('add new tag to the list', () => {
    beforeEach(async function () {
      await invoiceLineDetails.tagsAction.click();
      await tagsPane.whenLoaded();
      await tagsPane.selectedTags.fillTag('tag3');
      await tagsPane.addTag();
    });

    it('should add one new tag', () => {
      expect(invoiceLineDetails.tagsAction.count).to.equal((tags.length + 1).toString());
    });
  });
});
