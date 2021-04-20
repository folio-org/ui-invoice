import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import { FormattedMessage } from 'react-intl';

import {
  Modal,
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

  useEffect(() => {
    if (isLoading === false) {
      handlePrint();
    }
  }, [isLoading]);

  return (
    <>
      <Modal
        open={isLoading}
        label={<FormattedMessage id="ui-invoice.voucher.print.isLoading" />}
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
