# Change history for ui-invoice

## (IN PROGRESS)

* Allow user to filter invoices by Fund and Expense class. Refs UINV-367.
* Allow user to filter invoices by Lock total amount range. Refs UINV-366.
* Select filter should announce the number of Results in Result List pane header. Refs UINV-387.
* Allow editing of subscription dates and subscription info after an invoice is approved/paid. Refs UINV-375.
* On small screens the action menu is covered by the header. Refs UINV-374.
* Add "Voucher export" to actions menu. Refs UINV-368.
* Add "Export results (CSV)" action to invoice app. Refs UINV-383.
* Select batch group and display existing exports. Refs UINV-369.
* Run manual export and display toast. Refs UINV-370.
* Download batch export files from full screen view. Refs UINV-371.
* Allow user to select data points for Export results to CSV. Refs UINV-384.
* Export invoice functionality - FE approach. Refs UINV-385.
* Remove "Folio invoice number" from display in invoice line column. Refs UINV-390.
* Update accordion labels and logic on Invoice. Refs UINV-391.
* Invoice Date filter search results do not match. Refs UINV-392.
* Replace `babel-eslint` with `@babel/eslint-parser`. Refs UINV-393.
* Additional sort options for invoice lines: POL number and description. Refs UINV-283.
* Error handling for adding invoice line from POL. Refs UINV-398.
* ui-invoice: module warnings analysis. Refs UINV-404.
* Add copy icon to invoice number. Refs UINV-403.

## [3.1.1](https://github.com/folio-org/ui-invoice/tree/v3.1.1) (2022-03-22)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v3.1.0...v3.1.1)

* Un hide permission 'Invoice: Cancel invoices'. Refs UINV-362.
* Previous invoice is fetched when Approve and Pay action is called. Refs UINV-3

## [3.1.0](https://github.com/folio-org/ui-invoice/tree/v3.1.0) (2022-03-03)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v3.0.2...v3.1.0)

* Settings (Invoices) | Apply baseline keyboard shortcuts. Refs UINV-303.
* Tech debt: reducing code smells, usage of consts and resources from stripes-acq. Refs UINV-325.
* Indicate that accounting code is a required field when export to accounting is true. Refs UINV-324.
* Add POL vendor code to invoice line display. Refs UINV-333.
* Invoice - Allow user to choose what columns display for Invoice lines. Refs UINV-337.
* Include vendor primary address information on invoice. Refs UINV-332.
* Display past payments for a POL on an invoice line. Refs UINV-331.
* Add POL workflow status to invoice line display. Refs UINV-334.
* Add a return to Invoices default search to app context menu dropdown. Refs UINV-338.
* Allow user to filter invoices by Batch group. Refs UINV-335.
* Display receiving history for a POL on an invoice line. Refs UINV-340.
* When clicking back from invoice line take user back to that row in invoice line table. Refs UINV-347.
* 'Undefined' displayed for receipt status and payment status if Invoice Line was created without POL. Refs UINV-350.
* Adding tenant's timezone in UI. Refs UINV-351.
* Settings > Invoices > change focus. Refs UINV-344.
* Add pagination to Receiving history accordion MCL table. Refs UINV-353.
* Message of successful export is displayed after failing export. Refs UINV-354.
* Refactor psets away from backend ".all" permissions. Refs UINV-308.
* Invoice: Error message does not indicate what Fund does not have money. Refs UINV-357.
* ui-invoice: accessibility analysis. Refs UINV-360.

## [3.0.2](https://github.com/folio-org/ui-invoice/tree/v3.0.2) (2021-11-25)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v3.0.1...v3.0.2)

* Pro rated adjustments are applied incorrectly when adding multiple lines at a time. Refs UINV-327.

## [3.0.1](https://github.com/folio-org/ui-invoice/tree/v3.0.1) (2021-11-02)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v3.0.0...v3.0.1)

* Hide cancel invoice button. Refs UINV-310.
* Spelling issue - remove "s" from end of "PO numbers". Refs UINV-312.
* Error message displayed before invoice approval is submitted. Refs UINV-313.
* "Export to accounting" not displayed in adjustment view in settings. Refs UINV-318.

## [3.0.0](https://github.com/folio-org/ui-invoice/tree/v3.0.0) (2021-10-08)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.4.4...v3.0.0)

* Add cancel invoice option to action menu. Refs UINV-175.
* More informative UI error message for failed invoice approval. Refs UINV-280.
* Allow user to link an invoice line to a PO line from the invoice view. Refs UINV-267.
* ui-invoice: UI tests replacement with RTL/Jest. Refs FAT-38.
* Search invoice by PO number. Refs UINV-162.
* Add hover text to invoice link icon. Refs UINV-290.
* Increment stripes to v7. Refs UINV-284.
* Invoices - Implement MCL Next/Previous pagination. Refs UINV-293.
* Invoices - Resume Scroll position after edit. Refs UINV-295.
* Filter label contains extra 's'. Refs UINV-302.
* Settings (Invoice adjustments) | Apply baseline keyboard shortcuts. Refs UINV-304.

## [2.4.4](https://github.com/folio-org/ui-invoice/tree/v2.4.4) (2021-09-08)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.4.3...v2.4.4)

* global CSS styles force landscape printing in other modules. Refs UINV-298.

## [2.4.3](https://github.com/folio-org/ui-invoice/tree/v2.4.3) (2021-08-13)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.4.2...v2.4.3)
* Filter by Acquisition units in Invoice app is not worked. Refs UINV-286.

## [2.4.2](https://github.com/folio-org/ui-invoice/tree/v2.4.2) (2021-07-29)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.4.1...v2.4.2)

* Invoice level Fund Distribution not showing amount. Refs UINV-273.
* Search not working for some accounting codes. Refs UINV-275.

## [2.4.1](https://github.com/folio-org/ui-invoice/tree/v2.4.1) (2021-07-22)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.4.0...v2.4.1)

* Identical invoices/invoice lines are created after repeated clicking on the 'Save & close' button. Refs UINV-268.

## [2.4.0](https://github.com/folio-org/ui-invoice/tree/v2.4.0) (2021-06-17)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.3.2...v2.4.0)

* Update error code to prevent approval of invoice when organization is not a vendor. Refs UINV-215.
* Permissions for Expense class filter (find-po-line-plugin). Refs UIOR-678.
* Implement Keyboard shortcuts modal. Refs UINV-257.
* Compile Translation Files into AST Format. Refs UINV-251.
* Allow user to link an invoice line to a PO line after the invoice line has been created. Refs UINV-193.
* Update invoice field label to match PO field label. Refs UINV-259.
* eslint@"^7.9.0" causes peer-dep inconsistency. Refs UINV-260.
* Resizable Panes - Persistence | Use PersistedPaneset smart component. Refs UINV-253.
* Acquisition units no longer restrict edit create or delete actions from action menu. Refs UINV-238.
* Invoice app | Apply baseline shortcut keys. Refs UINV-237.
* Add Print action and icon to invoice actions menu. Refs UINV-232.
* Create HTML template for Printing voucher. Refs UINV-233.
* Print voucher from HTML template. Refs UINV-235.

## [2.3.2](https://github.com/folio-org/ui-invoice/tree/v2.3.2) (2021-06-02)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.3.1...v2.3.2)
* Invoice is only approved when user clicks 'approve and pay'. Refs UINV-262.

## [2.3.1](https://github.com/folio-org/ui-invoice/tree/v2.3.1) (2021-04-14)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.3.0...v2.3.1)

* Invoice details: Batch file status not displaying properly. Refs UINV-252.
* Budget not found by FundID error message not displayed to user. Refs UINV-247.
* Display Vendor primary address in voucher view. Refs UINV-236.
* Invoice lines are not in numerical order. Refs UINV-240.
* Cannot delete attached file from invoice. Refs UINV-244.
* Cannot approve invoice with a certain type of adjustment. Refs UINV-248.
* Manual Exporting of Invoice Fails. Refs UINV-241.

## [2.3.0](https://github.com/folio-org/ui-invoice/tree/v2.3.0) (2021-03-18)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.2.4...v2.3.0)

* Include account number from Invoice information in voucher. Refs UINV-227.
* Display "Enclosure needed" toggle on the invoice. Refs UINV-226.
* Display Invoice line number and add sorting. Refs UINV-230.
* Prevent approval of invoice when organization IS NOT a vendor. Refs UINV-215.
* Delete invoice with attached document. Refs UINV-170.
* Add Extended Info accordion to Invoice View screen. Refs UINV-222.
* Update view for Vendor reference number on invoice lines list. UINV-225.
* Display and filter paymentDate in Invoice module. Refs UINV-224.
* Make invoice line 'vendor reference number' and type repeatable, paired fields and populate from POL. Refs UINV-165.
* Show the possible duplicate modal on invoice edit. Refs UINV-209.
* Use `CurrencyExchangeRateFields` component from stripes-acq-components. Refs UIOR-610.
* Fix Invoice will not approve when "Export to accounting" is true. UINV-220.
* Fix accounting code select list always default on first selection. UINV-169.
* Make username not required. Refs UINV-210.
* Add personal data disclosure form. Refs UINV-212.
* Show the possible duplicate modal at point of invoice approval. Refs UINV-192.
* Display lock total on invoice view when there is one. Refs UINV-208.
* Lock total must equal Calculated total to approve invoice. Refs UINV-190.
* Implement "Lock total" create and edit invoice form logic. Refs UINV-191.
* Update invoice CRUD permissions. UINV-199.

## [2.2.4](https://github.com/folio-org/ui-invoice/tree/v2.2.4) (2021-03-02)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.2.3...v2.2.4)

* Acquisition unit field disabled on create form. Refs UINV-229

## [2.2.3](https://github.com/folio-org/ui-invoice/tree/v2.2.3) (2021-01-15)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.2.2...v2.2.3)

* Cannot save invoice if assigned an acquisition unit. Refs UINV-217

## [2.2.2](https://github.com/folio-org/ui-invoice/tree/v2.2.2) (2020-11-10)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.2.1...v2.2.2)

* Invoice date filters are off set by timezone somehow. Refs UINV-202.
* Can not see invoice note in the view pane. Refs UINV-200.
* Error message: Budget Expense Class not found. Refs UINV-198.

## [2.2.1](https://github.com/folio-org/ui-invoice/tree/v2.2.1) (2020-10-09)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.1.3...v2.2.1)

* Update create/edit record form inactive fields - Invoice line. Refs UINV-186
* Remove validation, add default Open status. Refs UIF-253
* Display batch voucher error message beside "Status". Refs UINV-188
* Update invoice view pane. Refs UINV-187
* Update create/edit Invoice form inactive fields. Refs UINV-185
* Voucher currency Not based on fiscal year. Refs UINV-184
* Invoice line record ux update. Refs UINV-183
* Update fund distribution UX. Refs UIF-245
* Invoice record UX updates. Refs UINV-182
* Add exchange rate to invoice. Refs UINV-115
* Fix Adjustment settings are not in alpha order. Refs UINV-177, UINV-178
* Add "Export to accounting" toggle and logic to organization/invoice record. Refs UIORGS-186
* Prevent paying with Funds that have insufficient amounts to cover distribution. Refs UINV-83
* Add validation to voucher number prefix on UI. Refs UINV-70
* Display warning when POL is Fully paid. Refs UINV-173
* Approve status can be selected during invoice create/edit. Refs UINV-174
* Select expense class for Order & Invoice Fund distribution. Refs UIF-213

### Stories
* [UINV-159](https://issues.folio.org/browse/UINV-159) Display voucher export details in exclusive accordion
* [UINV-167](https://issues.folio.org/browse/UINV-167) Cannot filter invoice by invoice line tag(s)
* [UINV-161](https://issues.folio.org/browse/UINV-161) Alert user when adding pol to invoice that has a different currency or vendor that the invoice

### Bug fixes
* [UISACQCOMP-2](https://issues.folio.org/browse/UISACQCOMP-2) ACQ - CurrencySelect values are not translated

## [2.1.3](https://github.com/folio-org/ui-invoice/tree/v2.1.3) (2020-07-01)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.1.2...v2.1.3)

### Stories
* [UISACQCOMP-3](https://issues.folio.org/browse/UISACQCOMP-3) Handle import of stripes-acq-components to modules and platform

### Bug fixes
* [UINV-163](https://issues.folio.org/browse/UINV-163) Search Keyword not working as expected
* [UINV-164](https://issues.folio.org/browse/UINV-164) Filter by "Acquisitions Unit" doesn't work
* [UINV-160](https://issues.folio.org/browse/UINV-160) Remaining amount of Fund distribution not formatted by invoice/order currency setting
* [UINV-156](https://issues.folio.org/browse/UINV-156) Support back-end changes related to accountingCode

## [2.1.2]https://github.com/folio-org/ui-invoice/tree/v2.1.2) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.1.0...v2.1.2)

* fixed tests;

## [2.1.0](https://github.com/folio-org/ui-invoice/tree/v2.1.0) (2020-06-12)
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

## [2.0.3](https://github.com/folio-org/ui-invoice/tree/v2.0.3) (2020-04-24)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.0.2...v2.0.3)

### Bug fixes
* [UINV-142](https://issues.folio.org/browse/UINV-142) user with invoice permissions can't CRUD invoice lines or add from POL

## [2.0.2](https://github.com/folio-org/ui-invoice/tree/v2.0.2) (2020-03-27)
[Full Changelog](https://github.com/folio-org/ui-invoice/compare/v2.0.0...v2.0.2)

### Bug fixes
* some amount of minor bug fixes related to screen refreshes and translations

## [2.0.0](https://github.com/folio-org/ui-invoice/tree/v2.0.0) (2020-03-13)
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
