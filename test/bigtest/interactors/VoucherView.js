import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

@interactor class Header {
  static defaultScope = '#pane-invoiceDetails [class*=paneTitleLabel---]';
}

@interactor class MenuActions {
  static defaultScope = '#voucher-actions';
  editLine = new Interactor('[data-test-edit-voucher-button]');
}

export default interactor(class VoucherView {
  static defaultScope = '#pane-voucher';

  // Actions
  actions = new MenuActions();

  header = new Header();
  voucherAccordion = isPresent('#voucher');
  voucherLinesAccordion = isPresent('#voucherLines')

  isLoaded = isPresent('[class*=LayerRoot---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
