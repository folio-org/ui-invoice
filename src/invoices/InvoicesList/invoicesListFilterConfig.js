import { FILTERS } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const filterConfig = [
  {
    name: FILTERS.STATUS,
    cql: FILTERS.STATUS,
    values: [],
  },
  {
    name: FILTERS.PAYMENT_METHOD,
    cql: FILTERS.PAYMENT_METHOD,
    values: [],
  },
  {
    name: FILTERS.VENDOR,
    cql: FILTERS.VENDOR,
    values: [],
  },
  {
    name: FILTERS.DATE_CREATED,
    cql: `metadata.${FILTERS.DATE_CREATED}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.INVOICE_DATE,
    cql: FILTERS.INVOICE_DATE,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.PAYMENT_DUE,
    cql: FILTERS.PAYMENT_DUE,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.APPROVAL_DATE,
    cql: FILTERS.APPROVAL_DATE,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.SOURCE,
    cql: FILTERS.SOURCE,
    values: [],
  },
  {
    name: FILTERS.EXPORT_TO_ACCOUNTING,
    cql: FILTERS.EXPORT_TO_ACCOUNTING,
    values: [],
  },
  {
    name: FILTERS.ACQUISITIONS_UNIT,
    cql: FILTERS.ACQUISITIONS_UNIT,
    values: [],
  },
  {
    name: FILTERS.TAGS,
    cql: 'tags.tagList',
    values: [],
  },
];
