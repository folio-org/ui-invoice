import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';

import {
  Layout,
  LoadingPane,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import {
  TagsBadge,
  VersionHistoryButton,
} from '@folio/stripes-acq-components';

const VersionView = ({
  children,
  id,
  isLoading,
  onVersionClose,
  tags,
  ...props
}) => {
  const { versionId } = useParams();

  const isVersionExist = versionId && !isLoading;

  const lastMenu = useMemo(() => (
    <PaneMenu>
      <TagsBadge
        disabled
        tagsQuantity={tags?.length}
      />
      <VersionHistoryButton disabled />
    </PaneMenu>
  ), [tags?.length]);

  if (isLoading) return <LoadingPane />;

  return (
    <Pane
      id={`${id}-version-view`}
      defaultWidth="fill"
      onClose={onVersionClose}
      lastMenu={lastMenu}
      {...props}
    >
      {
        isVersionExist
          ? children
          : (
            <Layout
              element="span"
              className="flex centerContent"
            >
              <FormattedMessage id="ui-invoice.invoice.versionHistory.noVersion" />
            </Layout>
          )
      }
    </Pane>
  );
};

VersionView.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onVersionClose: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.object),
};

export default memo(VersionView);
