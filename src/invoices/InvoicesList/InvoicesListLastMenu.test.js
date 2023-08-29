import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { InvoicesListLastMenu } from './InvoicesListLastMenu';

const defaultProps = {
  onToggle: jest.fn(),
  invoicesCount: 1,
};

const renderInvoicesListLastMenu = (props = defaultProps) => render(
  <InvoicesListLastMenu {...props} />,
  { wrapper: MemoryRouter },
);

describe('InvoicesListLastMenu', () => {
  it('should render correct structure', async () => {
    const { asFragment } = renderInvoicesListLastMenu();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Actions', () => {
    it('should call toggleExportModal prop', async () => {
      const onToggle = jest.fn();
      const toggleExportModal = jest.fn();

      renderInvoicesListLastMenu({ onToggle, toggleExportModal, invoicesCount: 1 });

      await user.click(screen.getByTestId('export-csv-button'));

      expect(onToggle).toHaveBeenCalled();
      expect(toggleExportModal).toHaveBeenCalled();
    });
  });
});
