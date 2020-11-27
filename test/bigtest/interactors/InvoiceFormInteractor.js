import {
  attribute,
  interactor,
  Interactor,
  isPresent,
  value,
  collection,
  fillable,
  clickable,
} from '@bigtest/interactor';

import {
  CheckboxInteractor,
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

@interactor class CurrencyInteractor {
  options = new OptionListInteractor('#sl-invoice-currency');
}

export default interactor(class InvoiceForm {
  static defaultScope = '#pane-invoice-form';
  isLoaded = isPresent('#invoiceForm-information');
  termsInput = new TextFieldInteractor('input[name="paymentTerms"]');
  termsInputValue = value('input[name="paymentTerms"]');
  vendorInvoiceNo = new Interactor('input[name="vendorInvoiceNo"]');
  invoiceDate = new Interactor('input[name="invoiceDate"]');
  approvalDate = new Interactor('input[name="approvalDate"]');
  paymentMethod = new PaymentMethodInteractor();
  status = new StatusInteractor();
  vendorField = new Interactor('input[name="vendorId"]');
  invoiceInformation = new Interactor('#accordion-toggle-button-invoiceForm-information');
  documentsAndLinks = new DocumentsInteractor();
  formFooter = new FormFooterInteractor();
  adjustments = isPresent('#adjustments');
  currency = new CurrencyInteractor();
  exchangeRate = new TextFieldInteractor('input[name="exchangeRate"]');
  exchangeRateReadOnly = attribute('input[name="exchangeRate"]', 'readonly');
  useSetExchangeRate = new CheckboxInteractor('#use-set-exhange-rate');
  organizationLookupBtn = clickable('[data-test-plugin-find-organization]');
  lockTotal = new CheckboxInteractor('#lock-total');
  manualAmount = new TextFieldInteractor('input[name="lockTotal"]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  whenDestroyed() {
    return this.timeout(5000).when(() => !this.isLoaded);
  }
});
