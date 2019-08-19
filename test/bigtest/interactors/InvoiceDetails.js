import {
  Interactor,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import TagsAction from './common/TagsAction';

@interactor class Header {
  static defaultScope = '#pane-invoiceDetails [class*=paneTitleLabel---]';
}

@interactor class MenuActions {
  static defaultScope = '#invoice-details-actions';
  deleteLine = new Interactor('[data-test-button-delete-invoice]');
  editLine = new Interactor('[data-test-button-edit-invoice]');
}

@interactor class ApprovedBy {
  static defaultScope = '[data-test-approved-by]';
  value = text('[class*=kvRoot---]');
}

export default interactor(class InvoiceDetails {
  static defaultScope = '#pane-invoiceDetails';

  // Actions
  actions = new MenuActions();
  tagsAction = new TagsAction('[data-test-invoice-tags-action]');

  buttonCreateLine = new Interactor('[data-test-button-create-line]');
  header = new Header();
  approvedBy = new ApprovedBy();
  voucherAccordion = isPresent('#voucher');

  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
