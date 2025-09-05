import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  Checkbox,
  checkScope,
  Col,
  ConfirmationModal,
  HasCommand,
  Icon,
  KeyValue,
  Layer,
  Pane,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import {
  stripesShape,
  TitleManager,
} from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { handleKeyCommand } from '@folio/stripes-acq-components';

import { hasEditSettingsPerm } from '../../utils';

const defaultProps = {
  adjustment: {},
};

const SettingsAdjustmentsView = ({
  close,
  adjustment = defaultProps.adjustment,
  history,
  stripes,
  rootPath,
  onDelete,
}) => {
  const intl = useIntl();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    alwaysShow,
    defaultAmount,
    description,
    exportToAccounting,
    id,
    metadata,
    prorate,
    relationToTotal,
    type,
  } = adjustment;

  const showConfirmDelete = () => setIsConfirmDeleteOpen(true);
  const hideConfirmDelete = () => setIsConfirmDeleteOpen(false);

  const deleteAdjustment = () => {
    hideConfirmDelete();
    onDelete();
  };

  const getActionMenu = ({ onToggle }) => {
    return (
      <div data-test-view-adjustment-actions>
        <Button
          data-test-view-adjustment-action-edit
          buttonStyle="dropdownItem"
          to={`${rootPath}/${id}/edit`}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-invoice.button.edit" />
          </Icon>
        </Button>
        <Button
          data-testid="adjustment-delete"
          data-test-view-adjustment-action-delete
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            showConfirmDelete();
          }}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-invoice.button.delete" />
          </Icon>
        </Button>
      </div>
    );
  };

  const renderHeader = (paneHeaderProps) => {
    return (
      <PaneHeader
        {...paneHeaderProps}
        actionMenu={hasEditSettingsPerm(stripes) && getActionMenu}
        dismissible
        onClose={close}
        paneTitle={description}
      />
    );
  };

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(close),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-invoice.settings.all')) history.push(`${rootPath}/${adjustment.id}/edit`);
      }),
    },
  ];

  return (
    <Layer
      contentLabel="Adjustment details"
      isOpen
    >
      <TitleManager
        page={intl.formatMessage({ id: 'ui-invoice.settings.adjustments.label' })}
        record={description}
      >
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <Pane
            id="invoice-settings-adjustment-view"
            defaultWidth="fill"
            renderHeader={renderHeader}
          >
            <Row center="xs">
              <Col xs={12} md={8}>
                <Row start="xs">
                  <Col xs={12}>
                    {metadata && <ViewMetaData metadata={metadata} />}
                  </Col>
                  <Col
                    xs={3}
                    data-test-description
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.description" />}
                      value={description}
                    />
                  </Col>
                  <Col
                    xs={3}
                    data-test-type
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.type" />}
                      value={type}
                    />
                  </Col>
                  <Col
                    data-test-always-show
                    xs={3}
                  >
                    <Checkbox
                      checked={alwaysShow}
                      disabled
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.alwaysShow" />}
                      type="checkbox"
                      vertical
                    />
                  </Col>
                  <Col
                    data-test-default-amount
                    xs={3}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.value" />}
                      value={defaultAmount}
                    />
                  </Col>
                  <Col
                    data-test-prorate
                    xs={3}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.prorate" />}
                      value={prorate}
                    />
                  </Col>
                  <Col
                    data-test-relation-to-total
                    xs={3}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.relationToTotal" />}
                      value={relationToTotal}
                    />
                  </Col>
                  <Col
                    data-test-export-to-accounting
                    xs={3}
                  >
                    <Checkbox
                      checked={exportToAccounting}
                      disabled
                      label={<FormattedMessage id="ui-invoice.settings.adjustments.exportToAccounting" />}
                      type="checkbox"
                      vertical
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            {isConfirmDeleteOpen && (
              <ConfirmationModal
                id="delete-adjustment-modal"
                confirmLabel={<FormattedMessage id="ui-invoice.settings.adjustments.confirmDelete.confirmLabel" />}
                heading={<FormattedMessage id="ui-invoice.settings.adjustments.confirmDelete.heading" values={{ description }} />}
                message={<FormattedMessage id="ui-invoice.settings.adjustments.confirmDelete.message" />}
                onCancel={hideConfirmDelete}
                onConfirm={deleteAdjustment}
                open
              />
            )}
          </Pane>
        </HasCommand>
      </TitleManager>
    </Layer>
  );
};

SettingsAdjustmentsView.propTypes = {
  adjustment: PropTypes.shape({}).isRequired,
  close: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  rootPath: PropTypes.string.isRequired,
  stripes: stripesShape.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default SettingsAdjustmentsView;
