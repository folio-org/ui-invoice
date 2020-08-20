import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class TagsPane {
  static defaultScope = '#input-tag-input';

  isLoaded = isPresent('[class*=multiSelectContainer---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
