import orderBy from 'lodash/orderBy';

export const getSettingsAdjustmentsList = (configs) => {
  return orderBy(configs.map(({ id, metadata, value = {} }) => {
    let adjustment = value || {};

    try {
      adjustment = JSON.parse(adjustment);
    } catch (e) {
      adjustment = {};
    }

    return {
      id,
      metadata,
      title: adjustment.description,
      adjustment,
    };
  }), ({ title }) => title);
};
