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
  ORDERS_API,
  useUsersBatch,
  VENDORS_API,
} from '@folio/stripes-acq-components';
import {
  acqUnit,
  address,
  orderAuditEvent,
  vendor,
} from '@folio/stripes-acq-components/test/jest/fixtures';
import { useSelectedInvoiceVersion } from './useSelectedInvoiceVersion';

jest.mock('@folio/stripes-acq-components/lib/hooks/useUsersBatch', () => ({
  useUsersBatch: jest.fn(() => ({ users: [], isLoading: false })),
}));

const order = {
  ...orderAuditEvent.orderSnapshot,
};

const user = {
  id: '58edf8c3-89e4-559c-9aed-aae637a3f40b',
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
      if (url.startsWith(ORDERS_API)) {
        return { ...order };
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

describe('useSelectedInvoiceVersion', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useUsersBatch.mockClear().mockReturnValue({
      isLoading: false,
      users: [user],
    });
  });

  it('should return Invoice version data', async () => {
    const { result } = renderHook(() => useSelectedInvoiceVersion({
      versionId: orderAuditEvent.id,
      versions: [{
        ...orderAuditEvent,
        orderSnapshot: {
          ...orderAuditEvent.orderSnapshot,
          acqUnitIds: ['acqUnitId'],
          billTo: address.id,
          vendor: vendor.id,
        },
      }],
      snapshotPath: 'orderSnapshot',
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    const {
      id,
      billTo,
      createdByUser,
      shipTo,
      vendor: vendorField,
    } = result.current.selectedVersion;

    expect(id).toEqual(order.id);
    expect(vendorField).toEqual(vendor.name);
    expect(billTo).toEqual('stripes-acq-components.versionHistory.deletedRecord');
    expect(shipTo).toEqual('stripes-acq-components.versionHistory.deletedRecord');
    expect(createdByUser).toEqual(getFullName(user));
  });
});
