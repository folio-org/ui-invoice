import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';
import PropTypes from 'prop-types';

import {
  Button,
  checkScope,
  HasCommand,
  Layout,
  NoValue,
  Pane,
  PaneFooter,
  Paneset,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import {
  DragDropMCL,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import { INVOICE_LINES_COLUMN_MAPPING } from '../constants';
import { getCommonInvoiceLinesFormatter } from '../utils';

export const InvoiceLinesSequence = ({
  addLines,
  invoice,
  lines,
  onClose,
  orders,
  poLines,
  vendors,
}) => {
  const [linesList, setLinesList] = useState(lines);
  const [isSaving, setIsSaving] = useState(false);

  const formatter = useMemo(() => {
    const ordersMap = keyBy(orders, 'id');
    const orderLinesMap = keyBy(poLines, 'id');
    const vendorsMap = keyBy(vendors, 'id');

    return {
      ...getCommonInvoiceLinesFormatter(invoice.currency, ordersMap, orderLinesMap),
      lineNumber: line => (
        <>
          <AppIcon app="invoice" size="small" />
          <Layout className="flex indent">{line.rowIndex + 1}</Layout>
        </>
      ),
      polNumber: line => orderLinesMap[line.poLineId]?.poLineNumber,
      vendorCode: line => {
        const orderLine = orderLinesMap?.[line.poLineId];

        return vendorsMap[ordersMap[orderLine?.purchaseOrderId]?.vendor]?.code || <NoValue />;
      },
    };
  }, [invoice, poLines, orders, vendors]);

  const paneFooter = useMemo(() => (
    <PaneFooter
      renderStart={(
        <Button
          buttonStyle="default mega"
          disabled={isSaving}
          onClick={onClose}
        >
          <FormattedMessage id="ui-invoice.button.cancel" />
        </Button>
      )}
      renderEnd={(
        <Button
          buttonStyle="primary mega"
          disabled={isSaving}
          onClick={() => addLines(linesList, { setIsSaving })}
        >
          <FormattedMessage id="ui-invoice.saveAndClose" />
        </Button>
      )}
    />
  ), [addLines, isSaving, linesList, onClose]);

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onClose, { disabled: isSaving }),
    },
    {
      name: 'save',
      handler: handleKeyCommand(() => addLines(linesList, { setIsSaving }), { disabled: isSaving }),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <Pane
          appIcon={<AppIcon app="invoice" size="small" />}
          defaultWidth="fill"
          footer={paneFooter}
          id="pane-lines-sequence"
          paneSub={
            <FormattedMessage
              id="ui-invoice.invoiceLine.linesSequence.paneSubTitle"
              values={{ count: lines.length }}
            />
          }
          paneTitle={
            <FormattedMessage
              id="ui-invoice.invoiceLine.linesSequence.paneTitle"
              values={{ vendorInvoiceNo: invoice.vendorInvoiceNo }}
            />
          }
        >
          <DragDropMCL
            contentData={linesList}
            columnMapping={INVOICE_LINES_COLUMN_MAPPING}
            formatter={formatter}
            id="invoice-lines-sequence"
            loading={isSaving}
            onUpdate={setLinesList}
            visibleColumns={Object.keys(INVOICE_LINES_COLUMN_MAPPING)}
          />
        </Pane>
      </Paneset>
    </HasCommand>
  );
};

InvoiceLinesSequence.propTypes = {
  addLines: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  lines: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  poLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  vendors: PropTypes.arrayOf(PropTypes.object).isRequired,
};
