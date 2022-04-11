export const invoiceLine = {
  description: 'EDI import invoice line',
  id: '729c379e-ed65-4e8b-ac28-3d75386a5ffc',
  invoiceId: '2e5067cd-2dc8-4d99-900d-b4518bb6407f',
  invoiceLineStatus: 'Open',
  quantity: '20',
  subTotal: 1523,
  subscriptionEnd: '2021-06-18',
  subscriptionStart: '2021-06-09',
  poLineId: '2e5067cd-2dc8-4d99-900d-b4518bb6407f',
  invoiceLineNumber: '1',
  referenceNumbers: [{
    refNumber: '9992',
    refNumberType: 'type',
  }],
  adjustments: [
    {
      id: '14263aab-b22b-4ddc-9ecc-3434427c2c8f',
      description: 'Service Fee',
      exportToAccounting: false,
      type: 'percentage',
      value: 10,
      prorate: 'By line',
      relationToTotal: 'In addition to',
    },
  ],
  fundDistributions: [
    {
      code: 'USHIST',
      encumbrance: 'e1a607b4-2ed3-4bd9-9c1e-3726737d5425',
      fundId: '65032151-39a5-4cef-8810-5350eb316300',
      distributionType: 'percentage',
      value: 50,
      expenseClassId: 'test-expense-class-id',
    },
  ],
};
