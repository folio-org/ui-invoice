import {
  interactor,
  Interactor,
  isPresent,
} from '@bigtest/interactor';

import FormFooterInteractor from './common/FormFooter';

export default interactor(class SettingsAdjustmentFormInteractor {
  static defaultScope = '#settings-adjustments-form';

  description = new Interactor('input[name="description"]');
  formFooter = new FormFooterInteractor();
  isLoaded = isPresent('#settings-adjustments-editor');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
