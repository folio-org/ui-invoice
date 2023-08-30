import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { CONTENT_TYPES } from '../../../common/constants';
import { BatchVoucherExportsList } from './BatchVoucherExportsList';

const defaultProps = {
  batchVoucherExports: [{ id: 'bvExportId', name: 'bvExportName' }],
  format: CONTENT_TYPES.json,
  isLoading: false,
  onHeaderClick: jest.fn(),
  onNeedMoreData: jest.fn(),
  pagination: {},
  totalCount: 1,
};

const renderBatchVoucherExportsList = (props = {}) => render(
  <BatchVoucherExportsList
    {...defaultProps}
    {...props}
  />,
);

describe('BatchVoucherExportsList', () => {
  it('should render MCList with corresponding columns', () => {
    renderBatchVoucherExportsList();

    expect(screen.getByText('ui-invoice.settings.BatchVoucherExports.date')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.settings.BatchVoucherExports.status')).toBeInTheDocument();
    expect(screen.getByText('ui-invoice.settings.BatchVoucherExports.message')).toBeInTheDocument();
  });
});
