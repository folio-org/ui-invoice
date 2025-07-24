import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';
import {
  Button,
  IconButton,
  TextField,
} from '@folio/stripes/components';
import { useOrderLine } from '@folio/stripes-acq-components';

import { CurrencyMismatchModal } from '../../../common/components';
import { useAsyncConfirmationModal } from '../../../common/hooks';

export const POLineField = ({
  currency,
  isNonInteractive,
  onSelect,
  poLineId,
}) => {
  const intl = useIntl();
  const { orderLine } = useOrderLine(poLineId);

  const {
    confirm,
    cancel,
    init,
    isModalOpen,
  } = useAsyncConfirmationModal();

  const selectLine = useCallback(async ([line]) => {
    if (line?.cost?.currency === currency) {
      onSelect(line);
    } else {
      await init()
        .then(() => onSelect(line))
        .catch(noop);
    }
  }, [currency, init, onSelect]);

  const clearLine = useCallback(() => {
    onSelect(undefined);
  }, [onSelect]);

  const pluginButton = useCallback(({ buttonRef, onClick }) => (
    <Button
      buttonRef={buttonRef}
      buttonStyle="link"
      key="searchButton"
      marginBottom0
      onClick={onClick}
    >
      {intl.formatMessage({ id: 'ui-invoice.poLineLookup' })}
    </Button>
  ), [intl]);

  const clearButton = useMemo(() => {
    if (poLineId && !isNonInteractive) {
      return (
        <IconButton
          ariaLabel={intl.formatMessage({ id: 'stripes-components.clearThisField' })}
          onClick={clearLine}
          icon="times-circle-solid"
          size="small"
        />
      );
    }

    return null;
  }, [intl, poLineId, isNonInteractive, clearLine]);

  return (
    <>
      <Field
        component={TextField}
        disabled
        endControl={clearButton}
        fullWidth
        hasClearIcon={false}
        label={intl.formatMessage({ id: 'ui-invoice.invoice.details.lines.list.polNumber' })}
        name="poLineId"
        format={() => orderLine?.poLineNumber}
        data-testid="field-order-line"
      />

      {!isNonInteractive && (
        <Pluggable
          addLines={selectLine}
          aria-haspopup="true"
          dataKey="find-po-line"
          isSingleSelect
          type="find-po-line"
          renderTrigger={pluginButton}
        >
          {intl.formatMessage({ id: 'ui-invoice.find-po-line-plugin-unavailable' })}
        </Pluggable>
      )}

      <CurrencyMismatchModal
        onCancel={cancel}
        onConfirm={confirm}
        open={isModalOpen}
      />
    </>
  );
};

POLineField.propTypes = {
  currency: PropTypes.string.isRequired,
  isNonInteractive: PropTypes.bool,
  poLineId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
