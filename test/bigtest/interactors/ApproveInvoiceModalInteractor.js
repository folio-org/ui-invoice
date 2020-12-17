import {
  clickable,
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class ApproveInvoiceModalInteractor {
  static defaultScope = '#approve-invoice-confirmation';

  cancel = clickable('[data-test-cancel-button]');
  confirm = clickable('[data-test-confirm-button]');

  isLoaded = isPresent('#duplicate-invoice-list');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
