import {
  interactor,
  Interactor,
  isPresent,
} from '@bigtest/interactor';

@interactor class Actions {
  static defaultScope = '[data-test-view-adjustment-actions]';
  delete = new Interactor('[data-test-view-adjustment-action-delete]');
  edit = new Interactor('[data-test-view-adjustment-action-edit]');
}

export default interactor(class SettingsAdjustmentDetailsInteractor {
  static defaultScope = '#invoice-settings-adjustment-view';

  actions = new Actions();

  isLoaded = isPresent('[data-test-description]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
