import {
  interactor,
  Interactor,
} from '@bigtest/interactor';

export default interactor(class FormFooterInteractor {
  static defaultScope = '[class*=paneFooter---]';

  saveButton = new Interactor('[data-test-save-button]');
  cancelButton = new Interactor('[data-test-cancel-button]');
});
