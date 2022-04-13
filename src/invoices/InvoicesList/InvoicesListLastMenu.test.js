import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import '../../../test/jest/__mock__';

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
  beforeEach(() => {
    global.document.createRange = global.document.originalCreateRange;
  });

  afterEach(() => {
    global.document.createRange = global.document.mockCreateRange;
  });

  it('should render correct structure', async () => {
    const { asFragment } = renderInvoicesListLastMenu();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Actions', () => {
    it('should call toggleExportModal prop', () => {
      const onToggle = jest.fn();
      const toggleExportModal = jest.fn();

      renderInvoicesListLastMenu({ onToggle, toggleExportModal, invoicesCount: 1 });

      user.click(screen.getByTestId('export-csv-button'));

      expect(onToggle).toHaveBeenCalled();
      expect(toggleExportModal).toHaveBeenCalled();
    });
  });
});
