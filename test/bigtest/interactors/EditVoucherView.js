import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class EditVoucherView {
  static defaultScope = '[data-test-edit-voucher-form]';

  voucherNumberInput= isPresent('input[name="voucherNumber"]');
  disbursementNumberInput= isPresent('input[name="disbursementNumber"]');
  disbursementDateInput= isPresent('input[name="disbursementDate"]');
  disbursementAmountInput= isPresent('input[name="disbursementAmount"]');

  isLoaded = isPresent('#pane-edit-voucher');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
