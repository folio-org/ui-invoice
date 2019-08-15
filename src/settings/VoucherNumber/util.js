import { get } from 'lodash';
// eslint-disable-next-line import/prefer-default-export
export const getVoucherNumberSetting = (configs, defaultConfig = {}) => {
  let settings = get(configs, [0, 'value'], '{}');
  try {
    settings = JSON.parse(settings);
  } catch (e) {
    settings = {};
  }

  return { ...defaultConfig, ...settings };
};
