import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { batchVoucherExportsResource } from '../../../common/resources';
import { BatchVoucherExportsList } from './BatchVoucherExportsList';

function BatchVoucherExportsListContainer({ batchGroupId, mutator }) {
  const [batchVoucherExports, setBatchVoucherExports] = useState();

  useEffect(
    () => {
      if (batchGroupId) {
        mutator.batchVoucherExports.GET({
          params: { query: `batchGroupId==${batchGroupId} sortby end/sort.descending start/sort.descending` },
        })
          .then(setBatchVoucherExports)
          .catch(() => setBatchVoucherExports([]));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [batchGroupId],
  );

  if (!batchVoucherExports) return null;

  return (
    <BatchVoucherExportsList
      batchVoucherExports={batchVoucherExports}
    />
  );
}

BatchVoucherExportsListContainer.manifest = Object.freeze({
  batchVoucherExports: batchVoucherExportsResource,
});

BatchVoucherExportsListContainer.propTypes = {
  batchGroupId: PropTypes.string,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(BatchVoucherExportsListContainer);
