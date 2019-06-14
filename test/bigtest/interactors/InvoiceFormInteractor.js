import {
  interactor,
  Interactor,
  isPresent,
  value,
} from '@bigtest/interactor';

export default interactor(class InvoiceForm {
  static defaultScope = '#pane-invoice-form';
  isLoaded = isPresent('[class*=paneTitleLabel---]');
  saveButton = new Interactor('[data-test-button-save-invoice]');
  termsInput = new Interactor('input[name="paymentTerms"]');
  termsInputValue = value('input[name="paymentTerms"]');
  invoiceInformation = new Interactor('#accordion-toggle-button-invoiceInformation');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
