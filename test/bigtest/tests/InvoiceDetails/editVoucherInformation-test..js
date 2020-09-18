import { beforeEach, describe } from '@bigtest/mocha';
import { expect } from 'chai';

import { INVOICE_STATUS } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import EditVoucherView from '../../interactors/VoucherEditInteractor';

describe('Edit voucher information', () => {
  setupApplication();

  const editVoucherView = new EditVoucherView();

  beforeEach(async function () {
    const user = this.server.create('user', {
      personal: {
        firstName: 'Diku',
        lastName: 'Admin',
      },
    });
    const invoice = this.server.create('invoice', {
      approvedBy: user.id,
      status: INVOICE_STATUS.approved,
    });

    const voucher = this.server.create('voucher', {
      invoiceId: invoice.id,
    });

    this.visit(`/invoice/view/${invoice.id}/voucher/${voucher.id}/edit`);
    await editVoucherView.whenLoaded();
  });

  it('Voucher edit form should be displayed', () => {
    expect(editVoucherView.disbursementNumberInput.isPresent).to.be.true;
    expect(editVoucherView.disbursementDateInput.isPresent).to.be.true;
    expect(editVoucherView.disbursementAmountInput.isPresent).to.be.true;
  });

  describe('Fill and save voucher form', () => {
    beforeEach(async function () {
      await editVoucherView.disbursementNumberInput.fill('test');
      await editVoucherView.disbursementAmountInput.fill('test');
      await editVoucherView.saveFormButton.click();
      await editVoucherView.whenDestroyed();
    });

    it('Close edit voucher form', () => {
      expect(editVoucherView.isPresent).to.be.false;
    });
  });
});
