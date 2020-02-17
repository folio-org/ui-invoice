import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';
import TagsPane from '../../interactors/InvoiceLineDetailsTags';

const tags = ['tag1', 'tag2'];

describe('Invoice details tags', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();

  beforeEach(async function () {
    const invoice = this.server.create('invoice', {
      tags: {
        tagList: tags,
      },
    });

    this.server.create('vendor', {
      id: invoice.vendorId,
    });

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
  });

  it('should be displayed', () => {
    expect(invoiceDetails.tagsAction.isPresent).to.be.true;
  });

  describe('click action', () => {
    const tagsPane = new TagsPane();

    beforeEach(async function () {
      await invoiceDetails.tagsAction.click();
      await tagsPane.whenLoaded();
    });

    it('should open tags pane', () => {
      expect(tagsPane.isPresent).to.be.true;
    });
  });
});
