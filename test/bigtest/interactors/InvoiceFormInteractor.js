import {
  interactor,
  Interactor,
  isPresent,
  value,
  collection,
  fillable,
} from '@bigtest/interactor';

import {
  TextFieldInteractor,
  OptionListInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import FormFooterInteractor from './common/FormFooter';

@interactor class PaymentMethodInteractor {
  static defaultScope = '#invoice-payment-method';
  value = value();
}

@interactor class StatusInteractor {
  options = new OptionListInteractor('#sl-invoice-status');
}

@interactor class VendorInteractor {
  options = new OptionListInteractor('#sl-invoice-vendor');
}

@interactor class DocumentsInteractor {
  options = new OptionListInteractor('#documents');

  documents = collection('[data-test-invoice-form-document]', {
    removeButton: new Interactor('[data-test-remove-document-button]'),
  });

  addLinkButton = new Interactor('#invoice-form-links [data-test-repeatable-field-add-item-button]');
  links = collection('#invoice-form-links [data-test-invoice-form-link]', {
    fillName: fillable('[data-test-invoice-form-link] [name$="name"]'),
    fillUrl: fillable('[data-test-invoice-form-link] [name$="url"]'),
    removeButton: new Interactor('#invoice-form-links [data-test-repeatable-field-remove-item-button]'),
  });
}

export default interactor(class InvoiceForm {
  static defaultScope = '#pane-invoice-form';
  isLoaded = isPresent('#invoiceInformation');
  termsInput = new TextFieldInteractor('input[name="paymentTerms"]');
  termsInputValue = value('input[name="paymentTerms"]');
  vendorInvoiceNo = new Interactor('input[name="vendorInvoiceNo"]');
  invoiceDate = new Interactor('input[name="invoiceDate"]');
  approvalDate = new Interactor('input[name="approvalDate"]');
  paymentMethod = new PaymentMethodInteractor();
  status = new StatusInteractor();
  vendor = new VendorInteractor();
  vendorButton = new Interactor('#invoice-vendor');
  invoiceInformation = new Interactor('#accordion-toggle-button-invoiceInformation');
  documentsAndLinks = new DocumentsInteractor();
  formFooter = new FormFooterInteractor();

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  whenDestroyed() {
    return this.timeout(5000).when(() => !this.isLoaded);
  }
});
