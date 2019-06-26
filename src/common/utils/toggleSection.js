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

export function expandAll(sections) {
  this.setState({ sections });
}
