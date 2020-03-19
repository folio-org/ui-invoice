import {
  collection,
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

@interactor class BatchVoucherExports {
  list = collection('[role="group"] [role="row"]', {
    downloadButton: new ButtonInteractor('[icon="download"]'),
  });
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

  batchVoucherExports = new BatchVoucherExports('#batch-voucher-exports');
  isLoaded = isPresent('#pane-batch-group-configuration');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  whenBatchVoucherExportsLoaded() {
    return this.timeout(10000).when(() => isPresent('#batch-voucher-exports'));
  }
}
