import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
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
  ...props
} = {}) => render(
  <TestForm
    onSubmit={jest.fn()}
    initialValues={initialValues}
    isNonInteractive={isNonInteractive}
    change={change}
    {...props}
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

  // TODO: release blocker: enable after release
  xit('should render correct structure with defined adjustments', async () => {
    const { asFragment } = renderForm({ initialValues: { adjustments: [adjustment] } });

    await screen.findByText('ui-invoice.adjustment.description');

    expect(asFragment()).toMatchSnapshot();
  });

  // TODO: release blocker: enable after release
  xit('should render correct structure without adjustments', async () => {
    const { asFragment } = renderForm();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should display adjustments details in non interactive mode', async () => {
    renderForm({ isNonInteractive: true });

    expect(screen.getByText('AdjustmentsDetails')).toBeDefined();
  });

  it('should reset expenseClassId on fiscalYearId changed', async () => {
    const change = jest.fn();

    renderForm({
      isNonInteractive: true,
      initialValues: { adjustments: [adjustment] },
      fiscalYearId: 'fiscalYearId',
      adjustments: [{
        'type': 'Amount',
        'description': '111',
        'value': 1,
        'relationToTotal': 'In addition to',
        'prorate': 'Not prorated',
        'fundDistributions': [{
          'distributionType': 'percentage',
          'value': 100,
          'fundId': '7fbd5d84-62d1-44c6-9c45-6cb173998bbd',
          'code': 'AFRICAHIST',
          'encumbrance': null,
          'expenseClassId': '1bcc3247-99bf-4dca-9b0f-7bc51a2998c2',
        }],
      }],
      isFiscalYearChanged: true,
      change,
    });

    expect(screen.getByText('AdjustmentsDetails')).toBeDefined();
    await waitFor(() => expect(change).toHaveBeenCalledWith('adjustments[0].fundDistributions[0].expenseClassId', null));
  });
});
