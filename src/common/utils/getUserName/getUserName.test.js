import { getUserName } from './getUserName';

describe('getUserName', () => {
  it('should return full name when user is full', () => {
    const user = {
      lastName: 'Rob',
      firstName: 'Mark',
      middleName: 'J.',
    };

    expect(getUserName({ personal: user })).toBe('Rob, Mark J.');
  });

  it('should return last name only when it is defined', () => {
    const user = {
      lastName: 'Rob',
    };

    expect(getUserName({ personal: user })).toBe('Rob');
  });
});
