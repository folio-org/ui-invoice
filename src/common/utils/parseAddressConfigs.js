// eslint-disable-next-line import/prefer-default-export
export const parseAddressConfigs = (addressConfigs = []) => addressConfigs.map(({ id, value }) => {
  const parsedAddress = JSON.parse(value);

  return {
    id,
    ...parsedAddress,
  };
});
