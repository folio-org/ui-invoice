import { saveAs } from 'file-saver';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import ExportVoucherButton from './ExportVoucherButton';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

const renderExportVoucherButton = (props) => (render(
  <ExportVoucherButton {...props} />,
));

describe('ExportVoucherButton', () => {
  beforeEach(() => {
    global.originalFetch = global.fetch;

    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = global.originalFetch;
  });

  it('should not display button when batchVoucherId is not defined', () => {
    renderExportVoucherButton({});

    expect(screen.queryByTestId('batch-voucher-export-download')).toBeNull();
  });

  it('should display button when batchVoucherId is defined', () => {
    renderExportVoucherButton({ batchVoucherId: 'batchVoucherId' });

    expect(screen.getByText('Icon')).toBeDefined();
  });

  it('should save fetched file when button is pressed', async () => {
    const blobData = 'blobData';
    const blob = jest.fn(() => Promise.resolve(blobData));
    const props = {
      batchVoucherId: 'batchVoucherId',
      format: 'Application/json',
      fileName: 'exportFIle',
    };

    saveAs.mockClear();
    global.fetch.mockClear().mockReturnValue(Promise.resolve({
      status: 200,
      blob,
    }));

    renderExportVoucherButton(props);

    await user.click(screen.getByText('Icon'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(saveAs).toHaveBeenCalledWith(blobData, `${props.fileName}.json`);
  });
});
