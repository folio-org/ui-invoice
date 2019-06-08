import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';

describe('Invoice details', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();

  beforeEach(async function () {
    const invoice = this.server.create('invoice');

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
  });

  it('should be displayed', () => {
    expect(invoiceDetails.isPresent).to.be.true;
  });
});
