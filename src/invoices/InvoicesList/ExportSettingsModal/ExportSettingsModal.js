import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import moment from 'moment';

import { useOkapiKy } from '@folio/stripes/core';
import {
  Button,
  Label,
  Layout,
  Loading,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup,
  MultiSelection,
  exportToCsv,
} from '@folio/stripes/components';

import { useShowCallout } from '@folio/stripes-acq-components';

import {
  EXPORT_INVOICE_LINE_FIELDS,
  EXPORT_INVOICE_FIELDS,
  EXPORT_INVOICE_LINE_FIELDS_OPTIONS,
  EXPORT_INVOICE_FIELDS_OPTIONS,
} from './constants';
import { getExportData } from './utils';

const SELECTED_INVOICE_FIELDS_ID = 'selected-invoice-fields';
const SELECTED_INVOICE_LINE_FIELDS_ID = 'selected-invoice-line-fields';

const ExportSettingsModal = ({ onCancel, query = '' }) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [isInvoiceExportAll, setIsInvoiceExportAll] = useState(true);
  const [invoiceFieldsToExport, setInvoiceFieldsToExport] = useState([]);
  const [isInvoiceLineExportAll, setIsInvoiceLineExportAll] = useState(true);
  const [invoiceLineFieldsToExport, setInvoiceLineFieldsToExport] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const showCallout = useShowCallout();

  const modalLabel = intl.formatMessage({ id: 'ui-invoice.exportSettings.label' });

  const onExportCSV = useCallback(async (exportFields) => {
    try {
      setIsExporting(true);

      showCallout({ messageId: 'ui-invoice.exportSettings.success' });

      const exportData = await getExportData({ ky, intl, query });

      setIsExporting(false);

      const filename = `invoice-export-${moment().format('YYYY-MM-DD-hh:mm')}`;

      exportToCsv(
        [{ ...EXPORT_INVOICE_FIELDS, ...EXPORT_INVOICE_LINE_FIELDS }, ...exportData],
        {
          onlyFields: exportFields,
          header: false,
          filename,
        },
      );

      return onCancel();
    } catch {
      onCancel();

      return showCallout({
        messageId: 'ui-invoice.exportSettings.error',
        type: 'error',
      });
    }
  },
  [intl, ky, onCancel, query, showCallout]);

  const isExportBtnDisabled = isExporting ||
    (!isInvoiceExportAll && !invoiceFieldsToExport.length) ||
    (!isInvoiceLineExportAll && !invoiceLineFieldsToExport.length);

  const onExport = useCallback(() => {
    const invoiceFields = isInvoiceExportAll
      ? Object.keys(EXPORT_INVOICE_FIELDS)
      : invoiceFieldsToExport.map(({ value }) => value);
    const invoiceLineFields = isInvoiceLineExportAll
      ? Object.keys(EXPORT_INVOICE_LINE_FIELDS)
      : invoiceLineFieldsToExport.map(({ value }) => value);

    return onExportCSV([...invoiceFields, ...invoiceLineFields]);
  },
  [isInvoiceExportAll, invoiceFieldsToExport, isInvoiceLineExportAll, invoiceLineFieldsToExport, onExportCSV]);

  const exportModalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={onExport}
        disabled={isExportBtnDisabled}
        marginBottom0
      >
        <FormattedMessage id="ui-invoice.exportSettings.export" />
      </Button>
      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-invoice.exportSettings.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      aria-label={modalLabel}
      open
      label={modalLabel}
      footer={exportModalFooter}
    >

      <p><FormattedMessage id="ui-invoice.exportSettings.message" /></p>

      {isExporting
        ? <Loading size="large" />
        : (
          <>
            <Label>
              <FormattedMessage id="ui-invoice.exportSettings.invoiceFieldsLabel" />
            </Label>

            <Layout className="display-flex flex-align-items-start">
              <Layout className="padding-end-gutter">
                <RadioButtonGroup>
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-invoice.exportSettings.invoice.all' })}
                    name="invoiceExport"
                    onChange={() => setIsInvoiceExportAll(true)}
                    checked={isInvoiceExportAll}
                  />
                  <RadioButton
                    id={SELECTED_INVOICE_FIELDS_ID}
                    aria-label={intl.formatMessage({ id: 'ui-invoice.exportSettings.invoice.selected' })}
                    name="invoiceExport"
                    onChange={() => setIsInvoiceExportAll(false)}
                  />
                </RadioButtonGroup>
              </Layout>

              <Layout>
                <Label>
                  <FormattedMessage id="ui-invoice.exportSettings.all" />
                </Label>
                <MultiSelection
                  aria-labelledby={SELECTED_INVOICE_LINE_FIELDS_ID}
                  dataOptions={EXPORT_INVOICE_FIELDS_OPTIONS}
                  onChange={setInvoiceFieldsToExport}
                  value={invoiceFieldsToExport}
                  disabled={isInvoiceExportAll}
                />
              </Layout>
            </Layout>

            <Label>
              <FormattedMessage id="ui-invoice.exportSettings.invoiceLineFieldsLabel" />
            </Label>

            <Layout className="display-flex flex-align-items-start">
              <Layout className="padding-end-gutter">
                <RadioButtonGroup>
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-invoice.exportSettings.invoiceLine.all' })}
                    name="invoiceLineExport"
                    onChange={() => setIsInvoiceLineExportAll(true)}
                    checked={isInvoiceLineExportAll}
                  />
                  <RadioButton
                    id={SELECTED_INVOICE_LINE_FIELDS_ID}
                    aria-label={intl.formatMessage({ id: 'ui-invoice.exportSettings.invoiceLine.selected' })}
                    name="invoiceLineExport"
                    onChange={() => setIsInvoiceLineExportAll(false)}
                  />
                </RadioButtonGroup>

              </Layout>
              <Layout>
                <Label>
                  <FormattedMessage id="ui-invoice.exportSettings.all" />
                </Label>
                <MultiSelection
                  aria-labelledby={SELECTED_INVOICE_LINE_FIELDS_ID}
                  dataOptions={EXPORT_INVOICE_LINE_FIELDS_OPTIONS}
                  onChange={setInvoiceLineFieldsToExport}
                  value={invoiceLineFieldsToExport}
                  disabled={isInvoiceLineExportAll}
                />
              </Layout>
            </Layout>
          </>
        )
      }
    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  query: PropTypes.string,
};

export default ExportSettingsModal;
