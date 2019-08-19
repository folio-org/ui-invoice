import {
  collection,
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import OptionListInteractor from './OptionListInteractor';
import TextFieldInteractor from './TextFieldInteractor';
import ButtonInteractor from './ButtonInteractor';
import SelectInteractor from './SelectInteractor';

@interactor class AdjustmentsForm {
  static defaultScope = '#adjustments';
  addButton = new ButtonInteractor('#adjustments-add-button');
  removeButtons = collection('[data-test-repeatable-field-remove-item-button]', ButtonInteractor);
  descriptionInputs = collection('[data-test-adjustment-description] input', TextFieldInteractor);
  amountInputs = collection('[data-test-adjustment-amount] input', TextFieldInteractor);
  relationToTotalInputs = collection('[data-test-adjustment-relation-to-total]', SelectInteractor);
}

export default interactor(class InvoiceLineFormInteractor {
  static defaultScope = '#invoice-line-form';
  buttonSave = new Interactor('[data-test-button-invoice-line-save]');
  description = new TextFieldInteractor('input[name="description"]');
  quantity = new TextFieldInteractor('input[name="quantity"]');
  subTotal = new TextFieldInteractor('input[name="subTotal"]');
  isLoaded = isPresent('[class*=paneTitleLabel---]');
  accountNumberButton = new Interactor('#invoice-line-account-number');
  accountNumberOptions = new OptionListInteractor('#sl-invoice-line-account-number');
  adjustmentsForm = new AdjustmentsForm();

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
