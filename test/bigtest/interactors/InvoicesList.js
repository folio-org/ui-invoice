import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class InvoicesListInteractor {
  static defaultScope = '[data-test-invoices-list]';

  hasCreateButton = isPresent('#clickable-newinvoice');

  invocies = collection('[role=row] a');
});
