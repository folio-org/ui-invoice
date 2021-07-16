import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import stripesFinalForm from '@folio/stripes/final-form';

import { adjustment } from '../../../test/jest/fixtures';

import AdjustmentsForm from './AdjustmentsForm';

jest.mock('../AdjustmentsDetails', () => jest.fn(() => 'AdjustmentsDetails'));

const TestForm = stripesFinalForm({})(
  (props) => {
    return (
      <form>
        <AdjustmentsForm {...props} />
      </form>
    );
  },
);

const renderForm = ({
  isNonInteractive = false,
  initialValues = {},
  change = jest.fn(),
} = {}) => render(
  <TestForm
    onSubmit={jest.fn()}
    initialValues={initialValues}
    isNonInteractive={isNonInteractive}
    change={change}
  />,
  { wrapper: MemoryRouter },
);

describe('AdjustmentsForm', () => {
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure with defined adjustments', async () => {
    const { asFragment } = renderForm({ initialValues: { adjustments: [adjustment] } });

    await screen.findByText('ui-invoice.adjustment.description');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correct structure without adjustments', async () => {
    const { asFragment } = renderForm();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display adjustments details in non interactive mode', async () => {
    renderForm({ isNonInteractive: true });

    expect(screen.getByText('AdjustmentsDetails')).toBeDefined();
  });
});
