export const parseAddressConfig = ({ id, value }) => {
  const parsedAddress = JSON.parse(value);

  return {
    id,
    ...parsedAddress,
  };
};

export const parseAddressConfigs = (addressConfigs = []) => addressConfigs.map(parseAddressConfig);
