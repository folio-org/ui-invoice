import { ACQUISITIONS_UNITS_API } from '../../../../src/common/constants';

const configUnits = server => {
  server.get(ACQUISITIONS_UNITS_API, (schema) => {
    return schema.units.all();
  });
};

export default configUnits;
