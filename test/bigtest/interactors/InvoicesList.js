import {
  collection,
  interactor,
  Interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class InvoicesListInteractor {
  static defaultScope = '[data-test-invoices-list]';

  newInvoiceButton = new Interactor('#clickable-newInvoice');

  invocies = collection('[role=group] [role=row]');

  isLoaded = isPresent('#invocies-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
