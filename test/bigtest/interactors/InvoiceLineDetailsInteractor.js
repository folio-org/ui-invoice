import {
  collection,
  Interactor,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import TagsAction from './common/TagsAction';

@interactor class Header {
  static defaultScope = '#pane-invoiceLineDetails [class*=paneTitleLabel---]';
}

@interactor class Actions {
  static defaultScope = '#invoice-line-details-actions';
  deleteLine = new Interactor('[data-test-button-delete-invoice-line]');
  editLine = new Interactor('[data-test-button-edit-invoice-line]');
}

@interactor class Adjustments {
  static defaultScope = '#adjustments';
  list = collection('#invoice-lines-adjustments-list [class*=mclRow---]', {
    rowText: text(),
  });
}

export default interactor(class InvoiceLineDetailsInteractor {
  static defaultScope = '#pane-invoiceLineDetails';

  adjustments = new Adjustments();
  actions = new Actions();
  header = new Header();
  buttonCloseLine = new Interactor('#pane-invoiceLineDetails [class*=paneHeader---] [class*=paneHeaderButtonsArea---] [class*=paneMenu---] [class*=iconButton---]');
  tagsAction = new TagsAction('[data-test-invoice-line-tags-action]');
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
