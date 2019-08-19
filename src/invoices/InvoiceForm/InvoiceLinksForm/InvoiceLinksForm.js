import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';

import {
  Col,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';

const linkNameLabel = <FormattedMessage id="ui-invoice.invoice.link.name" />;
const linkURLLabel = <FormattedMessage id="ui-invoice.invoice.link.url" />;
const addLinkLabel = <FormattedMessage id="ui-invoice.invoice.link.add" />;

const InvoiceLinksForm = () => {
  const renderLink = useCallback(
    (elem, index, fields) => {
      const isDisabled = Boolean(fields.get(index).id);

      return (
        <Row>
          <Col xs={4}>
            <Field
              component={TextField}
              label={linkNameLabel}
              name={`${elem}.name`}
              disabled={isDisabled}
            />
          </Col>
          <Col xs={8}>
            <Field
              component={TextField}
              label={linkURLLabel}
              name={`${elem}.url`}
              disabled={isDisabled}
            />
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
