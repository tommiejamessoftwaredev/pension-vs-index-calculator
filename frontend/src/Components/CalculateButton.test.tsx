import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalculateButton } from './CalculateButton';

describe('CalculateButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('should render calculate button with default text', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('🧮 Calculate Comparison')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading text when loading is true', () => {
    render(
      <CalculateButton
        loading={true}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('Calculating...')).toBeInTheDocument();
    expect(screen.queryByText('🧮 Calculate Comparison')).not.toBeInTheDocument();
  });

  it('should be disabled when loading is true', () => {
    render(
      <CalculateButton
        loading={true}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  it('should display validation error summary when validationErrors > 0', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
        validationErrors={2}
      />
    );

    expect(screen.getByText('⚠️ Please fix 2 validation errors before calculating')).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should display singular validation error message when validationErrors is 1', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
        validationErrors={1}
      />
    );

    expect(screen.getByText('⚠️ Please fix 1 validation error before calculating')).toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
        error="Something went wrong"
      />
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should not display error message when error is null', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
        error={null}
      />
    );

    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should be enabled when no blocking conditions are present', () => {
    render(
      <CalculateButton
        loading={false}
        onClick={mockOnClick}
        disabled={false}
        validationErrors={0}
      />
    );

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveClass('disabled');
  });

  it('should not call onClick when button is disabled', () => {
    render(
      <CalculateButton
        loading={true}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});