// eslint-disable-next-line import/prefer-default-export
export function toggleSection({ id }) {
  this.setState(({ sections }) => {
    const isSectionOpened = sections[id];

    return {
      sections: {
        ...sections,
        [id]: !isSectionOpened,
      },
    };
  });
}
