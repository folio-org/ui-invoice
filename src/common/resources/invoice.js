import {
  INVOICE_API,
  INVOICE_LINE_API,
} from '../constants';
import { BASE_RESOURCE } from './base';

export const invoiceResource = {
  ...BASE_RESOURCE,
  path: `${INVOICE_API}/:{id}`,
};

export const invoiceLineResource = {
  ...BASE_RESOURCE,
  path: `${INVOICE_LINE_API}`,
  GET: {
    path: `${INVOICE_LINE_API}/:{lineId}`,
  },
};
