import {
  interactor,
  Interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

@interactor class ScheduleExportInteractor {
  static defaultScope = 'select[name="scheduleExport"]';
  value = value();
}

@interactor class FormatInteractor {
  static defaultScope = 'select[name="format"]';
  value = value();
}

export default @interactor class BatchGroupConfigurationSettingsInteractor {
  static defaultScope = '[data-test-batch-group-configuration-settings]';

  saveButton = new ButtonInteractor('[data-test-save-button]');
  runManualExportButton = new ButtonInteractor('[data-test-run-manual-export-button]');
  batchGroup = isPresent('[data-test-batch-group-value]');
  batchGroupSelect = isPresent('[data-test-batch-group-select]');
  scheduleExport = new ScheduleExportInteractor();
  weekdays = isPresent('[data-test-col-weekdays]');;
  startTime = new Interactor('input[name="startTime"]');
  uploadURI = new Interactor('input[name="uploadURI"]');
  format = new FormatInteractor();
  validationMessage = text('[class*=feedbackError---]');

  isLoaded = isPresent('#pane-batch-group-configuration');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
}
