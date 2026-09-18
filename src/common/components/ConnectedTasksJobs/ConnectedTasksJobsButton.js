import { ConnectedTasksJobsPlugin, connectedTasksJobsPropTypes } from './ConnectedTasksJobsPlugin';

export const ConnectedTasksJobsButton = props => (
  <ConnectedTasksJobsPlugin
    {...props}
    componentType="ConnectedTasksJobsButton"
  />
);

ConnectedTasksJobsButton.propTypes = connectedTasksJobsPropTypes;
