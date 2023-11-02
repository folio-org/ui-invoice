import { Form } from 'react-final-form';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { CredentialsFieldsGroup } from '../CredentialsFieldsGroup';
import {
  CHAR_REPLACER,
  CredentialsField,
} from './CredentialsField';
import { CredentialsToggle } from '../CredentialsToggle';

const initialValues = {
  username: 'test',
  password: 'qwerty123',
};

const wrapper = ({ children }) => (
  <Form
    onSubmit={() => jest.fn()}
    initialValues={initialValues}
    render={() => (
      <CredentialsFieldsGroup>
        {children}
        <CredentialsToggle />
      </CredentialsFieldsGroup>
    )}
  />
);

const renderCredentialsField = (props = {}) => render(
  <CredentialsField
    name="username"
    {...props}
  />,
  { wrapper },
);

describe('CredentialsField', () => {
  describe('as final-form Field', () => {
    let field;

    beforeEach(() => {
      renderCredentialsField();
      field = screen.getByTestId('credentials-field');
    });

    it('should render field with \'password\' type if credentials are hidden', () => {
      expect(field.type).toBe('password');
    });

    it('should render field with \'text\' type if credentials are visible', async () => {
      const toggleBtn = screen.getByRole('button', { name: 'ui-invoice.settings.batchGroupConfiguration.password.show' });

      await user.click(toggleBtn);

      expect(field.type).toBe('text');
    });
  });

  describe('as non-interactive', () => {
    beforeEach(() => {
      renderCredentialsField({ isNonInteractive: true });
    });

    it('should not display value if credentials are hidden', () => {
      expect(screen.getByText(new RegExp(`[${CHAR_REPLACER}]{3,}`))).toBeInTheDocument();
    });

    it('should display value if credentials are visible', async () => {
      const toggleBtn = screen.getByRole('button', { name: 'ui-invoice.settings.batchGroupConfiguration.password.show' });

      await user.click(toggleBtn);

      expect(screen.getByText(initialValues.username)).toBeInTheDocument();
    });
  });
});
