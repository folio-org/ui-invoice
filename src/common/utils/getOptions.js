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
