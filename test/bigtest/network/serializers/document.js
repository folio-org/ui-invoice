import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.documents)) {
      return {
        documents: json.documents.map(invoiceDocument => ({
          id: invoiceDocument.documentMetadata.id,
          name: invoiceDocument.documentMetadata.name,
          invoiceId: invoiceDocument.documentMetadata.invoiceId,
          url: invoiceDocument.documentMetadata.url,
        })),
        totalRecords: json.documents.length,
      };
    }

    return json.documents;
  },
});
