import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class EditVoucherView {
  static defaultScope = '#pane-edit-voucher';

  saveButton = new Interactor('[data-test-voucher-save-button]');
  voucherForm = isPresent('[data-test-edit-voucher-form]');

  isLoaded = isPresent('[class*=LayerRoot---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
