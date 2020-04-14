import {
  collection,
  clickable,
  interactor,
  isPresent,
} from '@bigtest/interactor';
import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class SettingsAdjustmentsListInteractor {
  static defaultScope = '#setting-adjustments-pane';

  newButton = new ButtonInteractor('[data-test-new-adjustment-button]');
  list = collection('[data-test-nav-list-item]', {
    click: clickable(),
  });

  isLoaded = isPresent('[data-test-new-adjustment-button]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
