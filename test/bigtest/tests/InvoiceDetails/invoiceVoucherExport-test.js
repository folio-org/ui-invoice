import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  BATCH_VOUCHER_EXPORT_STATUS,
  INVOICE_STATUS,
} from '../../../../src/common/constants';
import { EXPORT_FORMAT } from '../../../../src/settings/BatchGroupConfigurationSettings/constants';
import setupApplication from '../../helpers/setup-application';
import InvoiceDetails from '../../interactors/InvoiceDetails';

describe('Invoice batch voucher export details', () => {
  setupApplication();

  const invoiceDetails = new InvoiceDetails();

  beforeEach(async function () {
    const user = this.server.create('user', {
      personal: {
        firstName: 'Diku',
        lastName: 'Admin',
      },
    });
    const batchGroup = this.server.create('batchgroup');
    const invoice = this.server.create('invoice', {
      approvedBy: user.id,
      batchGroupId: batchGroup.id,
      status: INVOICE_STATUS.approved,
    });

    this.server.create('exportConfig', {
      batchGroupId: batchGroup.id,
      format: EXPORT_FORMAT.json,
    });

    this.server.create('batchvoucherexport', {
      batchGroupId: batchGroup.id,
      status: BATCH_VOUCHER_EXPORT_STATUS.uploaded,
    });

    this.server.create('vendor', {
      id: invoice.vendorId,
    });

    this.visit(`/invoice/view/${invoice.id}`);
    await invoiceDetails.whenLoaded();
  });

  it('batch voucher export details accordion is presented', () => {
    expect(invoiceDetails.batchVoucherExportAccordion).to.be.true;
  });
});
