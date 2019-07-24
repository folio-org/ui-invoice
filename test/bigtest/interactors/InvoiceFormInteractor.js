import {
  interactor,
  Interactor,
  isPresent,
  value,
  text,
  clickable,
  collection,
} from '@bigtest/interactor';

import OptionListInteractor from './OptionListInteractor';

@interactor class PaymentMethodInteractor {
  options = new OptionListInteractor('#sl-invoice-payment-method');
}

@interactor class StatusInteractor {
  options = new OptionListInteractor('#sl-invoice-status');
}

@interactor class VendorInteractor {
  options = new OptionListInteractor('#sl-invoice-vendor');
}
export default interactor(class InvoiceForm {
  static defaultScope = '#pane-invoice-form';
  isLoaded = isPresent('[class*=paneTitleLabel---]');
  saveButton = new Interactor('[data-test-button-save-invoice]');
  termsInput = new Interactor('input[name="paymentTerms"]');
  termsInputValue = value('input[name="paymentTerms"]');
  vendorInvoiceNo = new Interactor('input[name="vendorInvoiceNo"]');
  invoiceDate = new Interactor('input[name="invoiceDate"]');
  approvalDate = new Interactor('input[name="approvalDate"]');
  paymentMethod = new PaymentMethodInteractor();
  status = new StatusInteractor();
  vendor = new VendorInteractor();
  vendorButton = new Interactor('#invoice-vendor');
  invoiceInformation = new Interactor('#accordion-toggle-button-invoiceInformation');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
