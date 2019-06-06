import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.invoices)) {
      return {
        invoices: json.invoices,
        totalRecords: json.invoices.length,
      };
    }

    return json.invoices;
  },
});
