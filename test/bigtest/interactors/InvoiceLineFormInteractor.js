import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import TextFieldInteractor from './TextFieldInteractor';

export default interactor(class InvoiceLineFormInteractor {
  static defaultScope = '#invoice-line-form';
  buttonSave = new Interactor('[data-test-button-invoice-line-save]');
  description = new TextFieldInteractor('input[name="description"]');
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
