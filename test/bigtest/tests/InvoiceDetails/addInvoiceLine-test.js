import React from 'react';
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Button } from '@folio/stripes/components';
import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';

const purchaseOrderId = 'fake order id';
const poLineId = 'fake line id';

describe('Add invoice line', function () {
  setupApplication({
    modules: [{
      type: 'plugin',
      name: '@folio/plugin-find-po-line',
      displayName: 'Find PO Line',
      pluginType: 'find-po-line',
      /* eslint-disable-next-line react/prop-types */
      module: ({ validateSelectedRecords }) => (
        <Button
          data-test-plugin-find-po-line-button
          onClick={() => validateSelectedRecords([{
            id: poLineId,
            purchaseOrderId,
            cost: {
              currency: 'EUR',
            },
          }])}
        >
          Add
        </Button>
      ),
    }],
  });

  this.timeout(10000);

  const invoiceDetails = new InvoiceDetails();
  const vendorConfirmation = new ConfirmationInteractor('#invoice-line-vendor-confirmation');
  const currencyConfirmation = new ConfirmationInteractor('#invoice-line-currency-confirmation');

  beforeEach(async function () {
    const invoice = this.server.create('invoice');
    const orderVendor = this.server.create('vendor');

    this.server.create('order', {
      id: purchaseOrderId,
      vendor: orderVendor.id,
    });

    this.server.create('vendor', {
      id: invoice.vendorId,
    });

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
    await invoiceDetails.linesSection.addLineBtn.click();
  });

  it('vendor confirmation modal is present', () => {
    expect(vendorConfirmation.isPresent).to.be.true;
  });

  describe('confirm adding line with another vendor', () => {
    beforeEach(async function () {
      await vendorConfirmation.confirm();
    });

    it('should close vendor confirmation modal', () => {
      expect(vendorConfirmation.isPresent).to.be.false;
    });

    it('should open currency confirmation modal', () => {
      expect(currencyConfirmation.isPresent).to.be.true;
    });

    describe('confirm adding line with another currency', () => {
      beforeEach(async function () {
        await currencyConfirmation.confirm();
        await invoiceDetails.whenLoaded();
      });

      it('should close currency confirmation modal', () => {
        expect(currencyConfirmation.isPresent).to.be.false;
      });

      it('should add new invoice line to invoice', () => {
        expect(invoiceDetails.linesSection.list().length).to.be.equal(1);
      });
    });
  });
});
