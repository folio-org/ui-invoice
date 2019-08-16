import {
  interactor,
  text,
} from '@bigtest/interactor';
import Button from '../../../../ui-orders/test/bigtest/interactors/button';

export default @interactor class SettingsVoucherNumberInteractor {
  static defaultScope = '[data-test-invoice-settings-voucher-number]';

  resetButton = new Button('[data-test-invoice-settings-voucher-number-reset]');
  startValue = text('[data-test-invoice-settings-voucher-number-start] [data-test-kv-value]');
}
