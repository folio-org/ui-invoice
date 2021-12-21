import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import { batchRequest } from '@folio/stripes-acq-components';

import { CATEGORIES_API } from '../../constants';

export const useAddressCategories = (address) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'vendor-address-categories' });

  const { isLoading, data = [] } = useQuery(
    [namespace, address],
    () => {
      return batchRequest(
        ({ params: searchParams }) => ky.get(CATEGORIES_API, { searchParams }).json(),
        address.categories,
      );
    },
    { enabled: Boolean(address.categories?.length) },
  );

  const categoriesMap = data[0]?.categories?.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.value }), {});

  return ({
    isLoading,
    categoriesMap,
  });
};
