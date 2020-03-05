import {
  collection,
  interactor,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  TextFieldInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

@interactor class BatchGroups {
  list = collection('[class*=editListRow---]', {
    nameInput: new TextFieldInteractor('input[type="text"]'),
    saveButton: new ButtonInteractor('#clickable-save-batch-groups-0'),
    cancelButton: new ButtonInteractor('#clickable-cancel-batch-groups-0'),
    editButton: new ButtonInteractor('#clickable-edit-batch-groups-0'),
    deleteButton: new ButtonInteractor('#clickable-delete-batch-groups-0'),
  });
}

export default @interactor class BatchGroupsSettingsInteractor {
  static defaultScope = '[data-test-batch-groups-settings]';

  newButton = new ButtonInteractor('#clickable-add-batch-groups');
  batchGroups = new BatchGroups('#editList-batch-groups');
}
