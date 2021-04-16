import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';

import {
  ConfirmationModal,
  Loading,
} from '@folio/stripes/components';

import usePrintData from './usePrintData';
import PrintContent from './PrintContent';

const PrintVoucherContainer = ({ invoice, closePrint }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: closePrint,
  });

  const { dataSource, isLoading } = usePrintData(invoice);

  return (
    <>
      <ConfirmationModal
        heading=""
        message={isLoading ? Loading : 'Print voucher?'}
        onCancel={closePrint}
        onConfirm={handlePrint}
        open
      />
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
