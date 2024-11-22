import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
import {
  ACQUISITIONS_UNITS_API,
  CONFIG_API,
  useUsersBatch,
  VENDORS_API,
} from '@folio/stripes-acq-components';
import {
  acqUnit,
  address,
  vendor,
} from '@folio/stripes-acq-components/test/jest/fixtures';

import { invoiceVersions, invoice } from 'fixtures';
import { useInvoice } from '../useInvoice';
import { useSelectedInvoiceLineVersion } from './useSelectedInvoiceLineVersion';

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
      if (url.startsWith(CONFIG_API)) {
        return { configs: [address] };
      }
      if (url.startsWith(VENDORS_API)) {
        return { organizations: [vendor] };
      }

      return {};
    },
  })),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSelectedInvoiceLineVersion', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useInvoice.mockClear().mockReturnValue({
      invoice: invoiceData,
      isLoading: false,
    });
    useUsersBatch.mockClear().mockReturnValue({
      isLoading: false,
      users: [user],
    });
  });

  it('should return Invoice version data', async () => {
    const { result } = renderHook(() => useSelectedInvoiceLineVersion({
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
