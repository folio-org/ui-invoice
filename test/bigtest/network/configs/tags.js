const configTags = server => {
  server.get('tags', () => {
    return [];
  });
};

export default configTags;
