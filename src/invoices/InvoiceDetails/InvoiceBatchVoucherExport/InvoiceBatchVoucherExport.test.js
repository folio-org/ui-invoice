import { render } from '@folio/jest-config-stripes/testing-library/react';

import { batchVoucherExport } from '../../../../test/jest/fixtures';

import InvoiceBatchVoucherExport from './InvoiceBatchVoucherExport';

jest.mock(
  '../../VoucherExport/ExportVoucherButton/ExportVoucherButton',
  () => jest.fn(() => 'ExportVoucherButton'),
);
jest.mock('../BatchGroupValue', () => jest.fn(() => 'BatchGroupValue'));

const defaultProps = {
  batchVoucherExport,
  exportFormat: 'json',
};
const renderInvoiceBatchVoucherExport = (props = defaultProps) => render(
  <InvoiceBatchVoucherExport {...props} />,
);

describe('InvoiceBatchVoucherExport', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure for invoice batch voucher export', () => {
    const { asFragment } = renderInvoiceBatchVoucherExport();

    expect(asFragment()).toMatchSnapshot();
  });
});
