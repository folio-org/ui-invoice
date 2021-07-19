export const getUserName = (user) => {
  const lastName = user?.personal?.lastName || '';
  const firstName = user?.personal?.firstName || '';
  const middleName = user?.personal?.middleName || '';

  return `${lastName}${firstName ? ', ' : ''}${firstName}${middleName ? ' ' : ''}${middleName}`;
};
