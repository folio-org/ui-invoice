import {
  interactor,
  text,
  is,
  property,
  attribute,
} from '@bigtest/interactor';

@interactor class ResetButton {
  static defaultScope = '[data-test-invoice-settings-voucher-number-reset]';

  isButton = is('button');
  isDisabled = property('disabled');
  disabled = attribute('disabled');
}

export default @interactor class SettingsVoucherNumberInteractor {
  static defaultScope = '[data-test-invoice-settings-voucher-number]';

  resetButton = new ResetButton();
  startValue = text('[data-test-invoice-settings-voucher-number-start] [data-test-kv-value]');
}
