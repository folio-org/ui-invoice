import React from 'react';
import { render, screen } from '@testing-library/react';
import { useReactToPrint } from 'react-to-print';

import { invoice } from '../../../test/jest/fixtures';

import PrintVoucherContainer from './PrintVoucherContainer';

jest.mock('react-to-print', () => ({
  useReactToPrint: jest.fn(),
}));
jest.mock('./usePrintData', () => jest.fn().mockReturnValue({ isLoading: false }));
jest.mock('./PrintContent', () => jest.fn().mockReturnValue('PrintContent'));

const defaultProps = {
  invoice,
  closePrint: jest.fn(),
};
const renderPrintVoucherContainer = (props = defaultProps) => render(
  <PrintVoucherContainer {...props} />,
);

describe('PrintVoucherContainer', () => {
  const handlePrint = jest.fn();

  beforeEach(() => {
    useReactToPrint.mockClear().mockReturnValue(handlePrint);
  });

  it('should display PrintContent', () => {
    renderPrintVoucherContainer();

    expect(screen.getByText('PrintContent')).toBeDefined();
  });

  it('should call handlePrint when loading is finished', () => {
    renderPrintVoucherContainer();

    expect(handlePrint).toHaveBeenCalled();
  });
});
