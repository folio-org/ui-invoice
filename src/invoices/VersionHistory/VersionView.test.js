import { useParams } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import VersionView from './VersionView';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ versionId: 'versionId' })),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: jest.fn().mockReturnValue('Loading'),
}));

describe('VersionView', () => {
  it('should display loading pane when isLoading is true', () => {
    render(<VersionView isLoading />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should display children when isLoading is false and versionId exists', () => {
    render(
      <VersionView isLoading={false}>
        <div>Children</div>
      </VersionView>,
    );
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('should display no version message when isLoading is false and versionId does not exist', () => {
    useParams.mockReturnValue({ versionId: null });

    render(<VersionView isLoading={false} />);
    expect(screen.getByText('ui-invoice.invoice.versionHistory.noVersion')).toBeInTheDocument();
  });
});
