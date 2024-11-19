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
import { VersionKeyValue } from '@folio/stripes-acq-components';

import { batchGroupByPropResource } from '../../../common/resources';

export const BatchGroupValue = ({ id, isVersionView, name, label, mutator }) => {
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

  const KeyValueComponent = isVersionView ? VersionKeyValue : KeyValue;

  if (!batchGroup) {
    return <Loading />;
  }

  return (
    <KeyValueComponent
      label={label}
      name={name}
      value={batchGroup.name}
    />
  );
};

BatchGroupValue.manifest = Object.freeze({
  invoiceBatchGroup: batchGroupByPropResource,
});

BatchGroupValue.propTypes = {
  id: PropTypes.string,
  isVersionView: PropTypes.bool,
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export default stripesConnect(BatchGroupValue);
