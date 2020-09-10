import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  KeyValue,
  RepeatableField,
  Row,
  TextField,
  TextLink,
} from '@folio/stripes/components';
import {
  validateRequired,
  validateURL,
} from '@folio/stripes-acq-components';

const linkNameLabel = <FormattedMessage id="ui-invoice.invoice.link.name" />;
const linkURLLabel = <FormattedMessage id="ui-invoice.invoice.link.url" />;
const addLinkLabel = <FormattedMessage id="ui-invoice.invoice.link.add" />;

const InvoiceLinksForm = () => {
  const renderLink = useCallback(
    (elem, index, fields) => {
      const isDisabled = Boolean(fields.value[index].id);

      return (
        <Row data-test-invoice-form-link>
          <Col
            data-test-invoice-form-link-name
            xs={4}
          >
            {isDisabled
              ? (
                <KeyValue
                  label={linkNameLabel}
                  value={fields.value[index].name}
                />
              )
              : (
                <Field
                  component={TextField}
                  label={linkNameLabel}
                  name={`${elem}.name`}
                  disabled={isDisabled}
                  required
                  validate={validateRequired}
                />
              )
            }
          </Col>
          <Col
            xs={8}
            data-test-invoice-form-link-url
          >
            {isDisabled
              ? (
                <KeyValue
                  label={linkURLLabel}
                  value={(
                    <TextLink
                      href={fields.value[index].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fields.value[index].url}
                    </TextLink>
                  )}
                />
              )
              : (
                <Field
                  component={TextField}
                  label={linkURLLabel}
                  name={`${elem}.url`}
                  disabled={isDisabled}
                  validate={validateURL}
                />
              )
            }
          </Col>
        </Row>
      );
    },
    [],
  );

  return (
    <Row>
      <Col xs={12}>
        <FieldArray
          id="invoice-form-links"
          addLabel={addLinkLabel}
          component={RepeatableField}
          name="links"
          renderField={renderLink}
        />
      </Col>
    </Row>
  );
};

export default InvoiceLinksForm;
