import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.voucherLines)) {
      return {
        voucherLines: json.voucherLines,
        totalRecords: json.voucherLines.length,
      };
    }

    return json.voucherLines;
  },
});
