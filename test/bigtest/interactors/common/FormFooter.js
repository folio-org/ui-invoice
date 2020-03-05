import {
  interactor,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class FormFooterInteractor {
  static defaultScope = '[class*=paneFooter---]';

  saveButton = new ButtonInteractor('[data-test-save-button]');
  cancelButton = new ButtonInteractor('[data-test-cancel-button]');
});
