export const getAdjustmentFromPreset = ({
  description,
  prorate,
  relationToTotal,
  type,
  defaultAmount,
  exportToAccounting,
}) => ({
  description,
  prorate,
  relationToTotal,
  type,
  value: defaultAmount,
  exportToAccounting,
});
