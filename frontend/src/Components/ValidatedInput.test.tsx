import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ValidatedInput } from './ValidatedInput';

describe('ValidatedInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render input with label', () => {
    render(
      <ValidatedInput
        value={100}
        onChange={mockOnChange}
        label="Test Input"
      />
    );

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    render(
      <ValidatedInput
        value={100}
        onChange={mockOnChange}
        label="Test Input"
      />
    );

    const input = screen.getByDisplayValue('100');
    fireEvent.change(input, { target: { value: '200' } });

    expect(mockOnChange).toHaveBeenCalledWith(200);
  });

  it('should display error message when error prop is provided', () => {
    render(
      <ValidatedInput
        value={100}
        onChange={mockOnChange}
        label="Test Input"
        error="Invalid value"
      />
    );

    expect(screen.getByText('Invalid value')).toBeInTheDocument();
  });

  it('should apply error classes when error is present', () => {
    render(
      <ValidatedInput
        value={100}
        onChange={mockOnChange}
        label="Test Input"
        error="Invalid value"
      />
    );

    const label = screen.getByText('Test Input');
    const input = screen.getByDisplayValue('100');

    expect(label).toHaveClass('error-label');
    expect(input).toHaveClass('input-error');
  });

  it('should not display error message when no error prop', () => {
    render(
      <ValidatedInput
        value={100}
        onChange={mockOnChange}
        label="Test Input"
      />
    );

    expect(screen.queryByText('Invalid value')).not.toBeInTheDocument();
  });

  it('should pass through HTML input attributes', () => {
    render(
      <ValidatedInput
        value={100}
        onChange={mockOnChange}
        label="Test Input"
        type="number"
        step="0.1"
        min="0"
        max="1000"
      />
    );

    const input = screen.getByDisplayValue('100') as HTMLInputElement;

    expect(input.type).toBe('number');
    expect(input.step).toBe('0.1');
    expect(input.min).toBe('0');
    expect(input.max).toBe('1000');
  });

  it('should default type to number', () => {
    render(
      <ValidatedInput
        value={100}
        onChange={mockOnChange}
        label="Test Input"
      />
    );

    const input = screen.getByDisplayValue('100') as HTMLInputElement;
    expect(input.type).toBe('number');
  });
});