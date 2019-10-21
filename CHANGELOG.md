# Change history for ui-invoice

## [1.2.0] (IN PROGRESS)
* [UINV-59](https://issues.folio.org/browse/UINV-12) Make invoice and invoice line adjustments amount formatted

## [1.1.0](https://github.com/folio-org/ui-invoice/tree/v1.1.0) (2019-09-11)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v1.0.0...v1.1.0)

### Stories
* [UINV-12](https://issues.folio.org/browse/UINV-12) Add "Voucher information" accordion to invoice
* [UINV-13](https://issues.folio.org/browse/UINV-13) View voucher from invoice
* [UINV-14](https://issues.folio.org/browse/UINV-14) Settings: Manage pre-set adjustments
* [UINV-15](https://issues.folio.org/browse/UINV-15) Create and save invoice details - Links section
* [UINV-19](https://issues.folio.org/browse/UINV-19) Display current total number of invoice lines on an invoice
* [UINV-22](https://issues.folio.org/browse/UINV-22) Settings: define voucher number format and reset sequence
* [UINV-29](https://issues.folio.org/browse/UINV-29) View invoice details
* [UINV-33](https://issues.folio.org/browse/UINV-33) Accounting code filter list populated based on vendor selected
* [UINV-36](https://issues.folio.org/browse/UINV-36) Populate invoice line "Account number" and "accounting code" based on POL details
* [UINV-37](https://issues.folio.org/browse/UINV-37) Assign tags to Invoice Records
* [UINV-38](https://issues.folio.org/browse/UINV-38) Assign tags to Invoice Line Records
* [UINV-43](https://issues.folio.org/browse/UINV-43) Search by accounting code
* [UINV-45](https://issues.folio.org/browse/UINV-45) invoice.source is an enum
* [UINV-46](https://issues.folio.org/browse/UINV-46) TECH-DEBT refactor styles in SettingsAdjustmentsEditor.js
* [UINV-48](https://issues.folio.org/browse/UINV-48) TECH-DEBT to cover Adjustments functionality by tests
* [UINV-51](https://issues.folio.org/browse/UINV-51) Display Adjustments and Total on invoice line
* [UINV-54](https://issues.folio.org/browse/UINV-54) Invoice number formating
* [UINV-56](https://issues.folio.org/browse/UINV-56) TECH-DEBT clean up warnings and errors (as much as possible) in invoice, stripes-acq-components
* [UINV-57](https://issues.folio.org/browse/UINV-57) Add fund distributions to invoice lines
* [UINV-62](https://issues.folio.org/browse/UINV-62) Require invoice approval to "pay" invoice
* [UINV-63](https://issues.folio.org/browse/UINV-63) Pay invoice button
* [UINV-67](https://issues.folio.org/browse/UINV-67) Remove hardcoded fund code/encumbranceId from new invoiceLine fundDistros
* [UINV-8](https://issues.folio.org/browse/UINV-8) Add adjustments to invoice line
* [UINV-9](https://issues.folio.org/browse/UINV-9) Setting: voucherNumber is editable (Boolean) and Add prefix to voucher number

### Bug Fixes
* [UINV-50](https://issues.folio.org/browse/UINV-50) User can "pro rate" adjustment from invoice line
* [UINV-52](https://issues.folio.org/browse/UINV-52) Invoice lines should be in numeric order on the Invoice Summary screen
* [UIOR-367](https://issues.folio.org/browse/UIOR-367) fix search query

## [1.0.0](https://github.com/folio-org/ui-invoice/tree/v1.0.0) (2019-07-23)
* New app created with stripes-cli
* Added default app icon (MODINVOICE-64)
* [UINV-32](https://issues.folio.org/browse/UINV-32) Invoice approval details set by system
* [UINV-26](https://issues.folio.org/browse/UINV-26) Search and filter for invoices
* [UINV-5](https://issues.folio.org/browse/UINV-5) Create and save invoice line details
* [UINV-7](https://issues.folio.org/browse/UINV-7) Add invoice line based on POL
* [UINV-3](https://issues.folio.org/browse/UINV-3) Create and save invoice details
* [UINV-4](https://issues.folio.org/browse/UINV-4) Implement three pane layout for invoice UI
