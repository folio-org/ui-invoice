# Change history for ui-invoice

## (IN PROGRESS)

### Stories

### Bug fixes
* [UINV-164](https://issues.folio.org/browse/UINV-164) Filter by "Acquisitions Unit" doesn't work
* [UINV-160](https://issues.folio.org/browse/UINV-160) Remaining amount of Fund distribution not formatted by invoice/order currency setting
* [UINV-156](https://issues.folio.org/browse/UINV-156) Support back-end changes related to accountingCode

## [2.1.2]https://github.com/folio-org/ui-invoice/tree/v2.1.2) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.1.0...v2.1.2)

* fixed tests;

## [2.1.0]https://github.com/folio-org/ui-invoice/tree/v2.1.0) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.0.3...v2.1.0)

### Stories
* [UIORGS-178](https://issues.folio.org/browse/UIORGS-178) Redirect API calls from mod-organizations-storage to mod-organzations
* [UINV-148](https://issues.folio.org/browse/UINV-148) update size limit error message to include the size limit
* [UINV-149](https://issues.folio.org/browse/UINV-149) Invoice app: Update to Stripes v4
* [UIREC-42](https://issues.folio.org/browse/UIREC-42) Filter by Acq unit
* [UINV-147](https://issues.folio.org/browse/UINV-147) Display record loading icon in view pane after user clicks action
* [UINV-146](https://issues.folio.org/browse/UINV-146) Support breaking changes on the back-end for Limit document size feature
* [UINV-126](https://issues.folio.org/browse/UINV-126) Download batch vouchers
* [UINV-138](https://issues.folio.org/browse/UINV-138) Align actions icons in table to right hand side of view pane(s)
* [UINV-123](https://issues.folio.org/browse/UINV-123) Add "Export to accounting" toggle to Adjustments
* [UINV-139](https://issues.folio.org/browse/UINV-139) Populate "Payment method" with Vendor payment method if available
* [UINV-110](https://issues.folio.org/browse/UINV-110) Test voucher settings ftp connection
* [UINV-130](https://issues.folio.org/browse/UINV-130) Add batch group to invoice
* [UINV-104](https://issues.folio.org/browse/UINV-104) Run voucher export manually
* [UINV-106](https://issues.folio.org/browse/UINV-106) Display Batch vouchers in settings

### Bug fixes
* [UINV-153](https://issues.folio.org/browse/UINV-153) Hide Delete option for invoices that are approved or paid
* [UINV-128](https://issues.folio.org/browse/UINV-128) Accessibility error: ID attribute value must be unique
* [UINV-127](https://issues.folio.org/browse/UINV-127) Accessibility Error: Form elements must have labels

## [2.0.3]https://github.com/folio-org/ui-invoice/tree/v2.0.3) (2020-04-24)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.0.2...v2.0.3)

### Bug fixes
* [UINV-142](https://issues.folio.org/browse/UINV-142) user with invoice permissions can't CRUD invoice lines or add from POL

## [2.0.2]https://github.com/folio-org/ui-invoice/tree/v2.0.2) (2020-03-27)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.0.0...v2.0.2)

### Bug fixes
* some amount of minor bug fixes related to screen refreshes and translations

## [2.0.0]https://github.com/folio-org/ui-invoice/tree/v2.0.0) (2020-03-13)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v1.2.1...v2.0.0)

* bump the @folio/stripes peer to v3.0.0

### Stories
* [UINV-124](https://issues.folio.org/browse/UINV-124) Invoices - Replace org selection components with organization lookup
* [UINV-117](https://issues.folio.org/browse/UINV-117) Allow user to edit voucher information
* [UINV-103](https://issues.folio.org/browse/UINV-103) Add voucher settings for a given Batch group
* [UINV-118](https://issues.folio.org/browse/UINV-118) TECH-DEBT refactor Invoice list to not use SearchAndSort
* [UINV-122](https://issues.folio.org/browse/UINV-122) Add "always show" preset adjustments to invoice when creating new invoice
* [UINV-101](https://issues.folio.org/browse/UINV-101) Invoice settings: Batch groupsCreate settings form for Batch group settings (Multiple Batch groups)
* [UINV-111](https://issues.folio.org/browse/UINV-111) Invoice settings: Batch groups
* [UINV-119](https://issues.folio.org/browse/UINV-119) Move record action buttons into "Action" button UX pattern
* [UINV-100](https://issues.folio.org/browse/UINV-100) Settings: Add Batch group and Batch group settings subheadings to invoice settings
* [UINV-114](https://issues.folio.org/browse/UINV-114) Invoice line not retrieving Total estimated price when linking POL
* [FOLIO-2436](https://issues.folio.org/browse/FOLIO-2436) organizations-storage.organizations version
* [UIOR-239](https://issues.folio.org/browse/UIOR-239) Use titleOrPackage instead of title
* [UINV-107](https://issues.folio.org/browse/UINV-107) Update settings permission label
* [UINV-112](https://issues.folio.org/browse/UINV-112) Security update eslint to >= 6.2.1 or eslint-util >= 1.4.1
* [MODORDERS-354](https://issues.folio.org/browse/MODORDERS-354) Divide the interface into smaller ones
* [UINV-109](https://issues.folio.org/browse/UINV-109) Limit document size
* [UIOR-472](https://issues.folio.org/browse/UIOR-472) Display encumbered value on POL for orders made in currency other than system currency
* [UINV-102](https://issues.folio.org/browse/UINV-102) Add translations

### Bug fixes
* [UINV-105](https://issues.folio.org/browse/UINV-105) Save and close and cancel bar not fixed to bottom of form
* [UINV-112](https://issues.folio.org/browse/UINV-112) Security update eslint to >= 6.2.1 or eslint-util >= 1.4.1

## [1.2.1](https://github.com/folio-org/ui-invoice/tree/v1.2.1) (2019-12-12)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v1.2.0...v1.2.1)

### Bug Fixes
* [UINV-93](https://issues.folio.org/browse/UINV-93) Address lookup not working in Invoices
* [UINV-94](https://issues.folio.org/browse/UINV-94) Not able to create invoice lines with $0 subtotal
* [UINV-96](https://issues.folio.org/browse/UINV-94) Can not create pre-set adjustments
* [UIOR-464](https://issues.folio.org/browse/UIOR-464) Calculation of estimated price in cost details sometimes blocks POLs from being created/saved

## [1.2.0](https://github.com/folio-org/ui-invoice/tree/v1.2.0) (2019-12-04)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v1.1.0...v1.2.0)

### Stories
* [UINV-66](https://issues.folio.org/browse/UINV-66) View invoice adjustments accordion
* [UINV-68](https://issues.folio.org/browse/UINV-68) Create fund distributions based on percentage or amount
* [UINV-71](https://issues.folio.org/browse/UINV-71) Add ability to specify fund distro for non-prorated invoice adjustments
* [UINV-76](https://issues.folio.org/browse/UINV-76) Cannot distinguish between percent and amount adjustments
* [UINV-80](https://issues.folio.org/browse/UINV-80) Update view for Fund distribution information on Invoice and invoice line
* [UINV-78](https://issues.folio.org/browse/UINV-78) Invoices: Update "save and close" and "Cancel" Buttons - UX
* [UINV-81](https://issues.folio.org/browse/UINV-81) Filter invoices by tags
* [UINV-85](https://issues.folio.org/browse/UINV-85) Approve and pay invoice in one click
* [UINV-2](https://issues.folio.org/browse/UINV-2) Duplication checking for vendor invoice number
* [UINV-82](https://issues.folio.org/browse/UINV-82) Display POL number instead of UUID
* [UINV-61](https://issues.folio.org/browse/UINV-61) Invoice View Details: Documents and Links section behavior
* [UINV-83](https://issues.folio.org/browse/UINV-83) Prevent paying with Funds that have insufficient amounts to cover distribution
* [UINV-88](https://issues.folio.org/browse/UINV-88) Date format inconsistent between search and edit screen

### Bug Fixes
* [UINV-64](https://issues.folio.org/browse/UINV-64) Do not allow user to Approve an Invoice in edit screen if status is "Paid"
* [STCOM-590](https://issues.folio.org/browse/STCOM-590) Invoice: MCL column width updates
* [UINV-42](https://issues.folio.org/browse/UINV-42) Shouldn't be allowed to add invoiceLines to an "approved" or "paid" invoice
* [UINV-65](https://issues.folio.org/browse/UINV-65) Show valid error message on "Approve" Invoice if voucher prefix is invalid
* [UIOR-365](https://issues.folio.org/browse/UIOR-365) fix acq units loading
* [UINV-72](https://issues.folio.org/browse/UINV-72) Change application menu name to plural
* [UINV-89](https://issues.folio.org/browse/UINV-89) Settings: Spelling mistake

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
