import { ConnectedTasksJobsPlugin, connectedTasksJobsPropTypes } from './ConnectedTasksJobsPlugin';

export const ConnectedTasksJobsPane = props => (
  <ConnectedTasksJobsPlugin
    {...props}
    componentType="ConnectedTasksJobsPane"
  />
);

ConnectedTasksJobsPane.propTypes = connectedTasksJobsPropTypes;
