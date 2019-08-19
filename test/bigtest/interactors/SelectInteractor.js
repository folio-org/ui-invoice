import {
  attribute,
  blurrable,
  focusable,
  interactor,
  is,
  isPresent,
  selectable,
  text,
  value,
} from '@bigtest/interactor';

export default interactor(class SelectInteractor {
  hasSelect = isPresent('select');
  isFocused = is('select', ':focus');
  val = value('select');
  selectOption = selectable('select');
  blurSelect = blurrable('select');
  focusSelect = focusable('select');
  id = attribute('select', 'id');
  labelFor = attribute('label', 'for');
  label = text('label');
  hasLabel = isPresent('label');

  selectAndBlur(val) {
    return this
      .selectOption(val)
      .blur('select');
  }
});
