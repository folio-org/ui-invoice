import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class InvoiceDetails {
  static defaultScope = '#pane-invoiceDetails';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
