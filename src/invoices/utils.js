export const getAdjustmentFromPreset = ({ description, prorate, relationToTotal, type, defaultAmount }) => ({
  description,
  prorate,
  relationToTotal,
  type,
  value: defaultAmount,
});
