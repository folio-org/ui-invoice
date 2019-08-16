import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.vouchers)) {
      return {
        vouchers: json.vouchers,
        totalRecords: json.vouchers.length,
      };
    }

    return json.vouchers;
  },
});
