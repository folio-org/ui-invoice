import {
  clickable,
  interactor,
} from '@bigtest/interactor';

export default interactor(class ConfirmationInteractor {
  cancel = clickable('[data-test-confirmation-modal-cancel-button]');
  confirm = clickable('[data-test-confirmation-modal-confirm-button]');
});
