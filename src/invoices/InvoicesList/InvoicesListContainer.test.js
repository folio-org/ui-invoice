import React from 'react';
import { render, screen, act } from '@testing-library/react';
import queryString from 'query-string';

import {
  useList,
} from '@folio/stripes-acq-components';

import { location, invoice } from '../../../test/jest/fixtures';

import InvoicesList from './InvoicesList';
import { InvoicesListContainerComponent, buildInvoicesQuery } from './InvoicesListContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useList: jest.fn().mockReturnValue({}),
}));
jest.mock('./InvoicesList', () => jest.fn().mockReturnValue('InvoicesList'));

const defaultProps = {
  mutator: {
    invoicesListInvoices: {
      GET: jest.fn().mockReturnValue(Promise.resolve([invoice])),
    },
    invoicesListOrganizations: {
      GET: jest.fn().mockReturnValue(Promise.resolve([])),
    },
  },
  location,
};
const renderInvoicesListContainer = (props = defaultProps) => render(
  <InvoicesListContainerComponent {...props} />,
);

describe('InvoicesListContainer', () => {
  it('should display InvoicesList', () => {
    renderInvoicesListContainer();

    expect(screen.getByText('InvoicesList')).toBeDefined();
  });

  it('should pass useList result to OrganizationsList', () => {
    const records = [invoice];

    InvoicesList.mockClear();
    useList.mockClear().mockReturnValue({ records });
    renderInvoicesListContainer();

    expect(InvoicesList.mock.calls[0][0].invoices).toBe(records);
  });

  it('should load invoices in useList', () => {
    defaultProps.mutator.invoicesListInvoices.GET.mockClear();
    useList.mockClear();

    renderInvoicesListContainer();

    useList.mock.calls[0][1](5);

    expect(defaultProps.mutator.invoicesListInvoices.GET).toHaveBeenCalledWith({
      params: {
        limit: 30,
        offset: 5,
        query: '(cql.allRecords=1) sortby name/sort.ascending',
      },
    });
  });

  it('should load invoice organizations in useList', async () => {
    defaultProps.mutator.invoicesListOrganizations.GET.mockClear();
    useList.mockClear();

    renderInvoicesListContainer();

    await act(async () => {
      await useList.mock.calls[0][2](jest.fn(), { invoices: [invoice] });
    });

    expect(defaultProps.mutator.invoicesListOrganizations.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${invoice.vendorId}`,
      },
    });
  });

  describe('search query', () => {
    it('should build query when search is active', () => {
      const expectedQuery = '(((voucherNumber="Amazon*" or vendorInvoiceNo="Amazon*" or accountingCode="Amazon*" or invoiceLines.description="Amazon*"))) sortby name/sort.ascending';

      expect(buildInvoicesQuery(queryString.parse('?query=Amazon'))).toBe(expectedQuery);
    });

    it('should build query when search by field is active', () => {
      const expectedQuery = '(((accountingCode="Amazon*"))) sortby name/sort.ascending';

      expect(buildInvoicesQuery(queryString.parse('?qindex=accountingCode&query=Amazon'))).toBe(expectedQuery);
    });
  });
});
