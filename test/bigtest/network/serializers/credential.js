import { BaseSerializer } from '@folio/stripes-acq-components/test/bigtest/network';

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    return json.credentials[0];
  },
});
