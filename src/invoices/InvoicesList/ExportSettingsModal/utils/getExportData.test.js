import { useIntl } from 'react-intl';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { getExportData } from './getExportData';

jest.mock('./createExportReport', () => ({
  createExportReport: jest.fn().mockReturnValue('test report'),
}));

test('should create export report', async () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  const report = await getExportData({ intl });

  expect(report).toEqual('test report');
});
