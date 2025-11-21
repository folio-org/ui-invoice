import PropTypes from 'prop-types';

import {
  KeyValue,
  Loading,
} from '@folio/stripes/components';
import { VersionKeyValue } from '@folio/stripes-acq-components';

import { useBatchGroup } from '../../../common/hooks';

export const BatchGroupValue = ({
  id,
  isVersionView,
  label,
  name,
}) => {
  const {
    batchGroup,
    isBatchGroupLoading,
  } = useBatchGroup(id);

  const KeyValueComponent = isVersionView ? VersionKeyValue : KeyValue;

  return (
    <KeyValueComponent
      label={label}
      name={name}
      value={isBatchGroupLoading ? <Loading /> : batchGroup?.name}
    />
  );
};

BatchGroupValue.propTypes = {
  id: PropTypes.string,
  isVersionView: PropTypes.bool,
  label: PropTypes.node.isRequired,
  name: PropTypes.string,
};

export default BatchGroupValue;
