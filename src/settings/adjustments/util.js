// eslint-disable-next-line import/prefer-default-export
export const getSettingsAdjustmentsList = (configs) => (
  configs.map(({ id, metadata, value = {} }) => {
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
  }));
