export const match = {
  url: 'url',
  path: 'path',
  params: {
    id: 'id',
  },
};

export const location = {
  hash: 'hash',
  search: 'search',
  pathname: 'pathname',
};

export const history = {
  action: 'PUSH',
  block: jest.fn(),
  push: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  replace: jest.fn(),
  location,
};
