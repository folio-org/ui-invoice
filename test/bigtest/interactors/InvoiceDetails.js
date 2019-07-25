import {
  Interactor,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class Header {
  static defaultScope = '#pane-invoiceDetails [class*=paneTitleLabel---]';
}

@interactor class Actions {
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
  buttonCreateLine = new Interactor('[data-test-button-create-line]');
  actions = new Actions();
  header = new Header();
  approvedBy = new ApprovedBy();

  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
