import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { configTags } from '../../../common/resources';
import TagsBadge from './TagsBadge';

const TagsBadgeContainer = ({ resources, tagsToggle, tagsQuantity }) => {
  const tagSettings = get(resources, ['configTags', 'records'], []);
  const tagsEnabled = !tagSettings.length || tagSettings[0].value === 'true';

  return (
    <TagsBadge
      tagsEnabled={tagsEnabled}
      tagsToggle={tagsToggle}
      tagsQuantity={tagsQuantity}
    />
  );
};

TagsBadgeContainer.manifest = Object.freeze({
  configTags,
});

TagsBadgeContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  tagsQuantity: PropTypes.number.isRequired,
};

export default stripesConnect(TagsBadgeContainer);
