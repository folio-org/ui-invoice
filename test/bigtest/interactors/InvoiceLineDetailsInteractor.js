import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

@interactor class Header {
  static defaultScope = '#pane-invoiceLineDetails [class*=paneTitleLabel---]';
}

@interactor class Actions {
  static defaultScope = '#invoice-line-details-actions';
  deleteLine = new Interactor('[data-test-button-delete-invoice-line]');
  editLine = new Interactor('[data-test-button-edit-invoice-line]');
}

export default interactor(class InvoiceLineDetailsInteractor {
  static defaultScope = '#pane-invoiceLineDetails';

  actions = new Actions();
  header = new Header();
  buttonCloseLine = new Interactor('#pane-invoiceLineDetails [class*=paneHeader---] [class*=paneHeaderButtonsArea---] [class*=paneMenu---] [class*=iconButton---]');
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
