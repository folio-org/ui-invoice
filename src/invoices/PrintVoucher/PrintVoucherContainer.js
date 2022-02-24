import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import { useIntl } from 'react-intl';

import {
  Modal,
  Loading,
} from '@folio/stripes/components';

import usePrintData from './usePrintData';
import PrintContent from './PrintContent';
import { getPrintPageStyles } from './utils';

const PrintVoucherContainer = ({ invoice, closePrint }) => {
  const intl = useIntl();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    pageStyle: getPrintPageStyles(),
    content: () => componentRef.current,
    onAfterPrint: closePrint,
  });

  const { dataSource, isLoading } = usePrintData(invoice);
  const modalLabel = intl.formatMessage({ id: 'ui-invoice.voucher.print.isLoading' });

  useEffect(() => {
    if (isLoading === false) {
      handlePrint();
    }
  }, [handlePrint, isLoading]);

  return (
    <>
      <Modal
        aria-label={modalLabel}
        open={isLoading}
        label={modalLabel}
        scope="module"
        size="small"
      >
        <Loading />
      </Modal>
      <PrintContent
        ref={componentRef}
        dataSource={dataSource}
      />
    </>
  );
};

PrintVoucherContainer.propTypes = {
  closePrint: PropTypes.func.isRequired,
  invoice: PropTypes.object,
};

export default PrintVoucherContainer;
