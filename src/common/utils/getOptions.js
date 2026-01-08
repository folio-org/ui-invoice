export const getAddressOptions = (addresses = []) => addresses.map(address => ({
  value: address.id,
  label: address.name,
})).sort((a, b) => a.label.localeCompare(b.label));

export const getAccountNumberOptions = (accountNumbers) => accountNumbers.map(number => ({
  value: number,
  label: number,
})).sort((a, b) => a.label.localeCompare(b.label));

export const getAdjustmentPresetOptions = (configAdjustments) => [
  { value: '', label: '' },
  ...configAdjustments.map(d => ({
    value: d.id,
    label: d.description,
  })).sort((a, b) => a.label.localeCompare(b.label)),
];

export const getBatchGroupsOptions = (batchGroups = []) => batchGroups.map(({ name, id }) => ({
  label: name,
  value: id,
})).sort((a, b) => a.label.localeCompare(b.label));
