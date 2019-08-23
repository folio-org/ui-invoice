import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  difference,
  isEqual,
  noop,
  sortBy,
} from 'lodash';

import { MultiSelection } from '@folio/stripes/components';

const filterItems = (filter, list) => {
  if (!filter) {
    return { renderedItems: list };
  }

  const filtered = list.filter(item => item.value.match(new RegExp(filter, 'i')));
  const renderedItems = filtered.sort((tag1, tag2) => {
    const regex = new RegExp(`^${filter}`, 'i');
    const match1 = tag1.value.match(regex);
    const match2 = tag2.value.match(regex);

    if (match1) return -1;
    if (match2) return 1;

    return (tag1.value < tag2.value) ? -1 : 1;
  });

  return { renderedItems };
};

const renderTag = ({ filterValue, exactMatch }) => {
  if (exactMatch || !filterValue) {
    return null;
  } else {
    return (
      <FormattedMessage
        id="ui-invoice.addTagFor"
        values={{ filterValue }}
      />
    );
  }
};

const TagsForm = ({
  allTags,
  entityTags,
  onAdd,
  onRemove,
}) => {
  const [savedTags, setSavedTags] = useState([]);

  useEffect(() => {
    if (!isEqual(entityTags, savedTags)) {
      setSavedTags(entityTags);
    }
  }, [entityTags, savedTags]);

  const onChange = useCallback(
    (tags) => {
      const updatedTags = tags.map(t => t.value);

      if (tags.length < savedTags.length) {
        const tag = difference(savedTags, tags.map(t => t.value));

        onRemove(tag[0]);
      } else onAdd(updatedTags);

      setSavedTags(updatedTags);
    },
    [savedTags],
  );

  const addTag = useCallback(
    ({ inputValue }) => {
      const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
      const updatedTags = savedTags.concat(tag);

      setSavedTags(updatedTags);
      onAdd(updatedTags);
    },
    [savedTags],
  );

  const addAction = { onSelect: addTag, render: renderTag };
  const actions = [addAction];
  const dataOptions = sortBy(allTags.map(t => ({ value: t.label.toLowerCase(), label: t.label.toLowerCase() })), ['value']);
  const tagsList = sortBy(savedTags.map(tag => ({ value: tag, label: tag })), ['value']);

  return (
    <FormattedMessage id="stripes-smart-components.enterATag">
      {placeholder => (
        <FormattedMessage id="stripes-smart-components.tagsTextArea">
          {ariaLabel => (
            <MultiSelection
              placeholder={placeholder}
              aria-label={ariaLabel}
              actions={actions}
              filter={filterItems}
              emptyMessage=" "
              onChange={onChange}
              dataOptions={dataOptions}
              value={tagsList}
            />
          )}
        </FormattedMessage>
      )}
    </FormattedMessage>
  );
};

TagsForm.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.object),
  entityTags: PropTypes.arrayOf(PropTypes.string),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};

TagsForm.defaultProps = {
  allTags: [],
  entityTags: [],
  onAdd: noop,
  onRemove: noop,
};

export default TagsForm;
