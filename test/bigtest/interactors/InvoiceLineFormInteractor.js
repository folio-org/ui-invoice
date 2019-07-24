import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import OptionListInteractor from './OptionListInteractor';
import TextFieldInteractor from './TextFieldInteractor';

export default interactor(class InvoiceLineFormInteractor {
  static defaultScope = '#invoice-line-form';
  buttonSave = new Interactor('[data-test-button-invoice-line-save]');
  description = new TextFieldInteractor('input[name="description"]');
  quantity = new TextFieldInteractor('input[name="quantity"]');
  subTotal = new TextFieldInteractor('input[name="subTotal"]');
  isLoaded = isPresent('[class*=paneTitleLabel---]');
  accountNumberButton = new Interactor('#invoice-line-account-number');
  accountNumberOptions = new OptionListInteractor('#sl-invoice-line-account-number');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
