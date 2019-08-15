import { get } from 'lodash';
// eslint-disable-next-line import/prefer-default-export
export const getVoucherNumberSetting = (configs) => {
  let settings = get(configs, [0, 'value'], '{}');
  const defaultSettings = {
    voucherNumberStart: 1,
  };

  try {
    settings = JSON.parse(settings);
  } catch (e) {
    settings = {};
  }

  return { ...defaultSettings, ...settings };
};
