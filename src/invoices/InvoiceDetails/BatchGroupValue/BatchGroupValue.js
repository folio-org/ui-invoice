import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  Loading,
} from '@folio/stripes/components';

import { batchGroupByPropResource } from '../../../common/resources';

const BatchGroupValue = ({ id, label, mutator }) => {
  const [batchGroup, setBatchGroup] = useState();

  useEffect(
    () => {
      setBatchGroup();

      if (id) {
        mutator.invoiceBatchGroup.GET()
          .then(setBatchGroup)
          .catch(() => setBatchGroup({}));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  if (!batchGroup) {
    return <Loading />;
  }

  return (
    <KeyValue
      label={label}
      value={batchGroup.name}
    />
  );
};

BatchGroupValue.manifest = Object.freeze({
  invoiceBatchGroup: batchGroupByPropResource,
});

BatchGroupValue.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(BatchGroupValue);
