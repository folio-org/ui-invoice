import {
  interactor,
  isPresent,
  Interactor,
} from '@bigtest/interactor';

export default interactor(class EditVoucherView {
  static defaultScope = '[data-test-edit-voucher-form]';

  voucherNumberInput= isPresent('input[name="voucherNumber"]');
  disbursementNumberInput = new Interactor('input[name="disbursementNumber"]');
  disbursementDateInput = new Interactor('input[name="disbursementDate"]');
  disbursementAmountInput = new Interactor('input[name="disbursementAmount"]');
  saveFormButton = new Interactor('[data-test-save-button]');

  isLoaded = isPresent('#pane-edit-voucher');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  whenDestroyed() {
    return this.timeout(5000).when(() => !this.isLoaded);
  }
});
