import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ActionMenu from './ActionMenu';

const defaultProps = {
  isDeletable: false,
  onDelete: jest.fn(),
  onEdit: jest.fn(),
};
const renderActionMenu = (props = defaultProps) => render(
  <ActionMenu {...props} />,
);

describe('InvoiceActions', () => {
  it('should display edit action', () => {
    renderActionMenu();

    expect(screen.getByTestId('invoice-line-edit')).toBeDefined();
  });

  it('should not display delete action when line can not be deleted', () => {
    renderActionMenu({ ...defaultProps, isDeletable: false });

    expect(screen.queryByTestId('invoice-line-delete')).toBeNull();
  });

  it('should display delete action when line can be deleted', () => {
    renderActionMenu({ ...defaultProps, isDeletable: true });

    expect(screen.getByTestId('invoice-line-delete')).toBeDefined();
  });
});
