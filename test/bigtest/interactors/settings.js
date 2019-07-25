import {
  interactor,
  text,
} from '@bigtest/interactor';

export default @interactor class SettingsInteractor {
  adjustments = text('#setting-adjustments-pane');
}
