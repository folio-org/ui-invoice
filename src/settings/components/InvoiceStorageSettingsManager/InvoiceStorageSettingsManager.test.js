import { Field } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useInvoiceStorageSettings } from '../../../common/hooks';
import { useInvoiceStorageSettingsMutation } from '../../hooks';
import { InvoiceStorageSettingsManager } from './InvoiceStorageSettingsManager';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => <div>Loading</div>),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useInvoiceStorageSettings: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useInvoiceStorageSettingsMutation: jest.fn(),
}));

const defaultProps = {
  configName: 'test-config',
  getInitialValues: jest.fn((settings) => ({ testField: settings?.[0]?.value || '' })),
  label: 'Test Label',
  onBeforeSave: jest.fn((data) => JSON.stringify(data)),
};

const renderComponent = (props = {}) => render(
  <InvoiceStorageSettingsManager
    {...defaultProps}
    {...props}
  >
    <form>
      <div>Test Form</div>
      <Field
        id="test"
        component="input"
        name="test"
        label="test"
      />
    </form>
  </InvoiceStorageSettingsManager>,
  { wrapper: MemoryRouter },
);

describe('InvoiceStorageSettingsManager', () => {
  const refetchMock = jest.fn();
  const mutateAsyncMock = jest.fn();
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    useShowCallout.mockReturnValue(showCalloutMock);
    useInvoiceStorageSettings.mockReturnValue({
      isFetching: false,
      settings: [
        {
          id: '1',
          key: 'test-config',
          value: 'test-value',
        },
      ],
      refetch: refetchMock,
    });

    useInvoiceStorageSettingsMutation.mockReturnValue({
      isLoading: false,
      upsertSetting: mutateAsyncMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should call getInitialValues with settings', () => {
    renderComponent();

    expect(defaultProps.getInitialValues).toHaveBeenCalledWith([
      {
        id: '1',
        key: 'test-config',
        value: 'test-value',
      },
    ]);
  });

  it('should call mutateAsync on form submit', async () => {
    renderComponent();

    await act(async () => {
      await userEvent.type(screen.getByRole('textbox'), 'hello');
      await userEvent.click(screen.getByRole('button', { name: /save/i }));
    });

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
    });
  });

  it('should display error message when mutation fails', async () => {
    mutateAsyncMock.mockRejectedValueOnce();

    renderComponent();

    await act(async () => {
      await userEvent.type(screen.getByRole('textbox'), 'hello');
      await userEvent.click(screen.getByRole('button', { name: /save/i }));
    });

    await waitFor(() => {
      expect(showCalloutMock).toHaveBeenCalledWith({
        messageId: 'ui-orders.settings.update.error',
        type: 'error',
      });
    });
  });

  it('should show loading state when isFetching is true', () => {
    useInvoiceStorageSettings.mockReturnValue({
      isFetching: true,
      settings: [],
      refetch: refetchMock,
    });

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
