import {
  collection,
  interactor,
  Interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class InvoicesListInteractor {
  static defaultScope = '[data-test-invoices-list]';

  newInvoiceButton = new Interactor('#clickable-newInvoice');

  invoices = collection('[data-row-inner]');

  isLoaded = isPresent('#invoices-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
