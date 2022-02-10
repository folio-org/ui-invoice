import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  Loading,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  PrevNextPagination,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import { SECTIONS_INVOICE_LINE } from '../../constants';
import { useReceivingHistory } from './useReceivingHistory';

const visibleColumns = [
  'caption',
  'copyNumber',
  'enumeration',
  'chronology',
  'receiptDate',
];
const columnMapping = {
  caption: <FormattedMessage id="ui-invoice.receivingHistory.caption" />,
  copyNumber: <FormattedMessage id="ui-invoice.receivingHistory.copyNumber" />,
  enumeration: <FormattedMessage id="ui-invoice.receivingHistory.enumeration" />,
  chronology: <FormattedMessage id="ui-invoice.receivingHistory.chronology" />,
  receiptDate: <FormattedMessage id="ui-invoice.receivingHistory.receiptDate" />,
};

const getResultFormatter = (poLine) => ({
  caption: piece => piece.caption || <NoValue />,
  copyNumber: piece => piece.copyNumber || <NoValue />,
  enumeration: piece => piece.enumeration || <NoValue />,
  chronology: piece => piece.chronology || <NoValue />,
  receiptDate: piece => (
    <Link
      to={{
        pathname: `/receiving/${piece.titleId}/view`,
        search: `qindex=poLine.poLineNumber&query=${poLine.poLineNumber}`,
      }}
    >
      <FormattedDate value={piece.receivedDate} />
    </Link>
  ),
});

const ReceivingHistory = ({ poLine = {} }) => {
  const [pagination, setPagination] = useState({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const {
    pieces,
    piecesCount,
    isLoading,
    isFetching,
  } = useReceivingHistory(poLine.id, { pagination });

  if (isLoading) return <Loading />;

  return (
    Boolean(pieces.length) && (
      <Accordion
        id={SECTIONS_INVOICE_LINE.receivingHistory}
        label={<FormattedMessage id="ui-invoice.receivingHistory" />}
      >
        <MultiColumnList
          columnMapping={columnMapping}
          contentData={pieces}
          formatter={getResultFormatter(poLine)}
          loading={isFetching}
          id="invoice-line-receiving-history"
          interactive={false}
          visibleColumns={visibleColumns}
        />
        <PrevNextPagination
          {...pagination}
          totalCount={piecesCount}
          onChange={setPagination}
          disabled={isFetching}
        />
      </Accordion>
    )
  );
};

ReceivingHistory.propTypes = {
  poLine: PropTypes.object,
};

export default ReceivingHistory;
