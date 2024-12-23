import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';
import { useOrderLine } from '@folio/stripes-acq-components';

import { POLineField } from './POLineField';

jest.mock('@folio/stripes-acq-components', () => ({
  useOrderLine: jest.fn(),
}));

const orderLine = { id: 'orderLineId', poLineNumber: '10000-2' };

// eslint-disable-next-line react/prop-types
const renderForm = (props) => (
  <form>
    <POLineField
      onSelect={() => { }}
      {...props}
    />
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => render(
  <FormCmpt onSubmit={() => { }} initialValues={{}} {...props} />,
  { wrapper: MemoryRouter },
);

describe('POLineField', () => {
  beforeEach(() => {
    useOrderLine.mockClear().mockReturnValue({ orderLine });
  });

  it('should format order line field value to line number', async () => {
    renderComponent({ poLineId: orderLine.id });

    await waitFor(() => expect(screen.getByTestId('field-order-line').value).toBe(orderLine.poLineNumber));
  });

  it('should display lookup plugin in interactive mode', async () => {
    renderComponent({ isNonInteractive: false, poLineId: orderLine.id });

    expect(screen.getByText('ui-invoice.find-po-line-plugin-unavailable')).toBeDefined();
  });

  it('should not display lookup plugin in non interactive mode', async () => {
    renderComponent({ isNonInteractive: true, poLineId: orderLine.id });

    expect(screen.queryByText('ui-invoice.find-po-line-plugin-unavailable')).toBeNull();
  });
});
