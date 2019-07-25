import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Button,
  Checkbox,
  Col,
  ConfirmationModal,
  Icon,
  KeyValue,
  Layer,
  Pane,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

class SettingsAdjustmentsView extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    adjustment: PropTypes.object,
    rootPath: PropTypes.string,
  };

  static defaultProps = {
    adjustment: { adjustment: {} },
  }

  state = {
    showConfirmDelete: false,
  };

  deleteAdjustment = () => {
    const { onDelete } = this.props;

    this.hideConfirmDelete();
    onDelete();
  };

  showConfirmDelete = () => this.setState({ showConfirmDelete: true });

  hideConfirmDelete = () => this.setState({ showConfirmDelete: false });

  getActionMenu = ({ onToggle }) => {
    const { rootPath, adjustment } = this.props;
    const id = get(adjustment, 'id');

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
          data-test-view-adjustment-action-delete
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            this.showConfirmDelete();
          }}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-invoice.button.delete" />
          </Icon>
        </Button>
      </div>
    );
  };

  render() {
    const {
      close,
      adjustment,
    } = this.props;
    const { showConfirmDelete } = this.state;
    const {
      metadata,
      title,
      adjustment: { alwaysShow, defaultAmount, description, type, prorate, relationToTotal },
    } = adjustment;

    return (
      <Layer
        contentLabel="Adjustment details"
        isOpen
      >
        <Pane
          actionMenu={this.getActionMenu}
          id="invoice-settings-adjustment-view"
          defaultWidth="fill"
          paneTitle={title}
          dismissible
          onClose={close}
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
                  <KeyValue label={<FormattedMessage id="ui-invoice.settings.adjustments.alwaysShow" />}>
                    <Checkbox
                      checked={alwaysShow}
                      disabled
                      type="checkbox"
                    />
                  </KeyValue>
                </Col>
                <Col
                  data-test-default-amount
                  xs={3}
                >
                  <KeyValue
                    label={<FormattedMessage id="ui-invoice.settings.adjustments.defaultAmount" />}
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
              </Row>
            </Col>
          </Row>
          {showConfirmDelete && (
            <ConfirmationModal
              id="delete-adjustment-modal"
              confirmLabel={<FormattedMessage id="ui-invoice.settings.adjustments.confirmDelete.confirmLabel" />}
              heading={<FormattedMessage id="ui-invoice.settings.adjustments.confirmDelete.heading" values={{ description }} />}
              message={<FormattedMessage id="ui-invoice.settings.adjustments.confirmDelete.message" />}
              onCancel={this.hideConfirmDelete}
              onConfirm={this.deleteAdjustment}
              open
            />
          )}
        </Pane>
      </Layer>
    );
  }
}

export default SettingsAdjustmentsView;
