import queryString from 'query-string';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useBuildQuery } from './useBuildQuery';

describe('useBuildQuery', () => {
  it('should return function, that return query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse('?foo=bar'))).toBe('(foo=="bar") sortby invoiceDate/sort.descending');
  });

  it('should return query with array field', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current({
      'limit': '50',
      'offset': '0',
      'tags.tagList': 'user*?',
    })).toBe('((tags.tagList=="*user*?*" or invoiceLines.tags.tagList=="*user*?*")) sortby invoiceDate/sort.descending');

    expect(result.current({
      'limit': '50',
      'offset': '0',
      'tags.tagList': [
        'user*?',
        'urgent',
      ],
    })).toBe('((tags.tagList==("*user*?*" or "*urgent*") or invoiceLines.tags.tagList==("*user*?*" or "*urgent*"))) sortby invoiceDate/sort.descending');
  });
});
