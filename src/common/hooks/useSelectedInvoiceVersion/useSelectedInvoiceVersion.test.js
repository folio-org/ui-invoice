import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
import {
  ACQUISITIONS_UNITS_API,
  useAddress,
  useUsersBatch,
  VENDORS_API,
} from '@folio/stripes-acq-components';
import {
  acqUnit,
  address,
  vendor,
} from '@folio/stripes-acq-components/test/jest/fixtures';

import {
  invoice,
  invoiceVersions,
} from 'fixtures';
import { useInvoice } from '../useInvoice';
import { useSelectedInvoiceVersion } from './useSelectedInvoiceVersion';

jest.mock('@folio/stripes-acq-components/lib/hooks/useAddress', () => ({
  useAddress: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components/lib/hooks/useUsersBatch', () => ({
  useUsersBatch: jest.fn(() => ({ users: [], isLoading: false })),
}));

jest.mock('../useInvoice', () => ({
  useInvoice: jest.fn(),
}));

const invoiceData = {
  ...invoice,
};

const user = {
  id: 'd7b3f1f2-0d1b-4b3f-8e1b-3f1d7b3f1b3f',
  personal: { firstName: 'Galt', lastName: 'John' },
};

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      if (url.startsWith(ACQUISITIONS_UNITS_API)) {
        return { acquisitionsUnits: [acqUnit] };
      }
      if (url.startsWith(VENDORS_API)) {
        return { organizations: [vendor] };
      }

      return {};
    },
  })),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSelectedInvoiceVersion', () => {
  beforeEach(() => {
    useAddress.mockReturnValue({ addresses: [address], isLoading: false });
    useOkapiKy.mockReturnValue(kyMock);
    useInvoice.mockReturnValue({
      invoice: invoiceData,
      isLoading: false,
    });
    useUsersBatch.mockReturnValue({
      isLoading: false,
      users: [user],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Invoice version data', async () => {
    const { result } = renderHook(() => useSelectedInvoiceVersion({
      versionId: '4',
      versions: invoiceVersions,
      snapshotPath: 'invoiceSnapshot.map',
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    const {
      id,
      billTo,
      createdByUser,
      vendor: vendorField,
    } = result.current.selectedVersion;

    expect(id).toEqual(invoiceData.id);
    expect(vendorField).toEqual(vendor.name);
    expect(billTo).toEqual('stripes-acq-components.versionHistory.deletedRecord');
    expect(createdByUser).toEqual(getFullName(user));
  });
});
