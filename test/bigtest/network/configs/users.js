import { USERS_API } from '../../../../src/common/constants';

const configUsers = server => {
  server.get(`${USERS_API}/:id`, (schema, request) => {
    return schema.users.find(request.params.id).attrs;
  });
};

export default configUsers;
