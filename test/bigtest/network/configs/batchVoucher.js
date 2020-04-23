import { Response } from 'miragejs';

import {
  BATCH_VOUCHERS_API,
  CONTENT_TYPES,
} from '../../../../src/common/constants';

const getJSON = (id) => ({
  'id': `${id}`,
  'batchGroup': 'Amherst College (AC)',
  'start': '2019-12-06T00:00:00.000+0000',
  'end': '2019-12-07T00:00:00.000+0000',
  'created': '2019-12-07T00:01:04.000+0000',
  'batchedVouchers': [
    {
      'accountingCode': '0206',
      'amount': 23.45,
      'disbursementNumber': 'EFT546789',
      'disbursementDate': '2019-12-06T00:01:04.000+0000',
      'disbursementAmount': 23.45,
      'enclosureNeeded': false,
      'exchangeRate': 1,
      'folioInvoiceNo': '123invoicenumber45',
      'invoiceCurrency': 'USD',
      'invoiceNote': 'Process immediately',
      'status': 'Paid',
      'systemCurrency': 'USD',
      'type': 'Voucher',
      'voucherDate': '2019-12-06T00:00:00.000+0000',
      'voucherNumber': '1023',
      'vendorName': 'GOBI',
      'vendorInvoiceNo': 'YK75851',
      'batchVoucherLines': [
        {
          'amount': 23.45,
          'externalAccountNumber': '54321098',
          'fundCodes': [
            'HIST',
            'LATHIST',
            'CANHIST',
          ],
        },
      ],
    },
  ],
  'totalRecords': 1,
});
const getXML = (id) => (
  `<batchVoucher>
    <id>${id}</id>
    <batchGroup>Amherst College (AC)</batchGroup>
    <created>2019-12-07T00:01:04Z</created>
    <start>2019-12-06T00:00:00Z</start>
    <end>2019-12-07T00:00:00Z</end>
    <batchedVouchers>
      <batchedVoucher>
        <accountingCode>0206</accountingCode>
        <amount>23.45</amount>
        <batchedVoucherLines>
          <batchedVoucherLine>
            <amount>23.45</amount>
            <fundCodes>
              <fundCode>HIST</fundCode>
              <fundCode>LATHIST</fundCode>
              <fundCode>CANHIST</fundCode>
            </fundCodes>
            <externalAccountNumber>54321098</externalAccountNumber>
          </batchedVoucherLine>
        </batchedVoucherLines>
        <disbursementNumber>EFT546789</disbursementNumber>
        <disbursementDate>2019-12-06T00:01:04Z</disbursementDate>
        <disbursementAmount>23.45</disbursementAmount>
        <enclosureNeeded>false</enclosureNeeded>
        <exchangeRate>1</exchangeRate>
        <folioInvoiceNo>123folionumber456</folioInvoiceNo>
        <invoiceCurrency>USD</invoiceCurrency>
        <invoiceNote>Process immediately</invoiceNote>
        <status>Paid</status>
        <systemCurrency>USD</systemCurrency>
        <type>Voucher</type>
        <vendorInvoiceNo>YK75851</vendorInvoiceNo>
        <vendorName>GOBI</vendorName>
        <voucherDate>2019-12-06T00:00:00Z</voucherDate>
        <voucherNumber>1023</voucherNumber>
      </batchedVoucher>
    </batchedVouchers>
    <totalRecords>1</totalRecords>
  </batchVoucher>`
);

export default server => {
  server.get(`${BATCH_VOUCHERS_API}/:id`, (schema, { requestHeaders, params }) => {
    const body = requestHeaders.accept === CONTENT_TYPES.json ? getJSON(params.id) : getXML(params.id);

    return new Response(200, { 'Content-Type': requestHeaders.accept }, body);
  });
};
