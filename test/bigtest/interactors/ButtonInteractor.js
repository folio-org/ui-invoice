import {
  interactor,
  is,
  property,
} from '@bigtest/interactor';

class ButtonInteractor {
  isButton = is('button');
  isDisabled = property('disabled');
}

export default interactor(ButtonInteractor);
