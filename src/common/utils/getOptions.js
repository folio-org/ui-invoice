export const getOrganizationOptions = (orgs = []) => orgs.map(org => ({
  value: org.id,
  label: `${org.name} (${org.code})`,
}));

export const getAddressOptions = (addresses = []) => addresses.map(address => ({
  value: address.id,
  label: address.name,
}));

export const getAccountNumberOptions = (accountNumbers) => accountNumbers.map(number => ({
  value: number,
  label: number,
}));

export const getAdjustmentPresetOptions = (configAdjustments) => [
  { value: '', label: '' },
  ...configAdjustments.map(d => ({
    value: d.id,
    label: d.adjustment.description,
  })),
];
