import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import ComponentToPrint from '../ComponentToPrint';

import css from './PrintContent.css';

const PrintContent = forwardRef(({ dataSource }, ref) => {
  return (
    <div className={css.hiddenContent}>
      <div ref={ref}>
        {dataSource && (
          <div
            key={dataSource.id}
          >
            <ComponentToPrint
              dataSource={dataSource}
            />
          </div>
        )}
      </div>
    </div>
  );
});

PrintContent.propTypes = {
  dataSource: PropTypes.object,
};

export default memo(PrintContent, isEqual);
