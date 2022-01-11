import React from 'react';

import { Loading } from '@folio/stripes/components';
import { SelectionFilter } from '@folio/stripes-acq-components';

import { useBatchGroupOptions } from './useBatchGroupOptions';

const BatchGroupFilter = (props) => {
  const { isLoading, batchGroupOptions } = useBatchGroupOptions();

  if (isLoading) return <Loading />;

  return (
    <SelectionFilter
      {...props}
      options={batchGroupOptions}
    />
  );
};

export default BatchGroupFilter;
