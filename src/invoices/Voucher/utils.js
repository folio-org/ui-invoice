export const groupByExternalAccNumber = voucherLines => (
  voucherLines.reduce(
    (acc, line) => ({
      ...acc,
      [line.externalAccountNumber]: (acc[line.externalAccountNumber] || []).concat(line),
    }),
    {},
  )
);

export const getTotalAmount = grupedVoucherLines => (
  grupedVoucherLines.map(({ amount }) => amount).reduce((acc, amount) => (acc + amount), 0)
);
