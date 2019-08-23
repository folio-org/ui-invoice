import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IconButton,
  PaneMenu,
} from '@folio/stripes/components';

const TagsBadge = ({ tagsToggle, tagsQuantity, tagsEnabled }) => (
  <PaneMenu>
    {tagsEnabled && (
      <FormattedMessage id="ui-invoice.showTags">
        {(title) => (
          <IconButton
            ariaLabel={title}
            badgeCount={tagsQuantity}
            data-test-invoice-line-tags-action
            icon="tag"
            id="clickable-show-tags"
            onClick={tagsToggle}
            title={title}
          />
        )}
      </FormattedMessage>
    )}
  </PaneMenu>
);

TagsBadge.propTypes = {
  tagsEnabled: PropTypes.bool.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  tagsQuantity: PropTypes.number.isRequired,
};

export default TagsBadge;
