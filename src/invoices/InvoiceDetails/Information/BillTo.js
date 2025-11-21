import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Loading,
  NoValue,
} from '@folio/stripes/components';
import { useAddress } from '@folio/stripes-acq-components';

import css from '../../Invoice.css';

const BillTo = ({ billToId }) => {
  const {
    address,
    isLoading,
  } = useAddress(billToId);

  return (
    <KeyValue label={<FormattedMessage id="ui-invoice.invoice.billTo" />}>
      {
        isLoading
          ? <Loading />
          : <div className={css.addressWrapper}>{billToId ? address?.address : <NoValue />}</div>
      }
    </KeyValue>
  );
};

BillTo.propTypes = {
  billToId: PropTypes.string,
};

export default BillTo;
