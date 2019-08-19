import {
  interactor,
  text,
  is,
  clickable,
  property,
} from '@bigtest/interactor';

@interactor class ResetButton {
  static defaultScope = '[data-test-invoice-settings-voucher-number-reset]';

  isButton = is('button');
  isDisabled = property('disabled');
}

@interactor class CheckAllowEditVoucherNumber {
  static defaultScope = 'input[name="allowVoucherNumberEdit"]';
  clickInput = clickable();
  isChecked = property('checked');
}

@interactor class StartVoucherNumber {
  static defaultScope = 'input[name="sequenceNumber"]';
  isDisabled = property('disabled');
}

export default @interactor class SettingsVoucherNumberInteractor {
  static defaultScope = '[data-test-invoice-settings-voucher-number]';

  resetButton = new ResetButton();
  startValue = text('[data-test-invoice-settings-voucher-number-start] [data-test-kv-value]');
  startVoucherNumberField = new StartVoucherNumber();
  allowEditVoucherNumber = new CheckAllowEditVoucherNumber()
}
