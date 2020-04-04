import {
  collection,
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import {
  OptionListInteractor,
  TextFieldInteractor,
  SelectInteractor,
  ButtonInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';
import FormFooterInteractor from './common/FormFooter';

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
  description = new TextFieldInteractor('input[name="description"]');
  quantity = new TextFieldInteractor('input[name="quantity"]');
  subTotal = new TextFieldInteractor('input[name="subTotal"]');
  isLoaded = isPresent('#invoiceLineForm-information');
  accountNumberButton = new Interactor('#invoice-line-account-number');
  accountNumberOptions = new OptionListInteractor('#sl-invoice-line-account-number');
  adjustmentsForm = new AdjustmentsForm();
  formFooter = new FormFooterInteractor();

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
