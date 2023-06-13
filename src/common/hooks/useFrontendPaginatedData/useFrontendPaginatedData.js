import { useMemo } from 'react';

export const useFrontendPaginatedData = (data = [], pagination = {}) => {
  const { offset, limit } = pagination;
  const contentData = useMemo(() => data.slice(offset, offset + limit), [data, offset, limit]);

  return contentData;
};
