import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class BatchGroupConfigurationSettingsInteractor {
  static defaultScope = '[data-test-batch-group-configuration-settings]';

  isLoaded = isPresent('#pane-batch-group-configuration');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
}
