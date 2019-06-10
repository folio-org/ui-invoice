import {
  collection,
  interactor,
  Interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class InvoicesListInteractor {
  static defaultScope = '[data-test-invoices-list]';

  newInvoiceButton = new Interactor('#clickable-newinvoice');

  invocies = collection('[role=row] a');

  isLoaded = isPresent('#pane-results');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
