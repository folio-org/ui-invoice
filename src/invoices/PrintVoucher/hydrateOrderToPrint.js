export function hydrateOrderToPrint({ order }) {
  if (!order) {
    return undefined;
  }

  const billToAddress = order.exportData?.[0].billToRecord?.address;
  const shipToAddress = order.exportData?.[0].shipToRecord?.address;
  const vendorPrimaryAddress = order.exportData?.[0].vendorRecord?.addresses?.find(({ isPrimary }) => isPrimary);
  const vendorPrimaryPhone = order.exportData?.[0].vendorRecord?.phoneNumbers?.find(({ isPrimary }) => isPrimary);

  return {
    ...order,
    billToAddress,
    shipToAddress,
    vendorPrimaryAddress,
    vendorPrimaryPhone,
    vendor: order.exportData?.[0].vendorRecord,
  };
}
