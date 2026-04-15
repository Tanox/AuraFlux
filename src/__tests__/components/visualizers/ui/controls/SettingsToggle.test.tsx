/**
 * File: src/components/visualizers/ui/controls/SettingsToggle.test.tsx
 * Version: v1.9.36
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsToggle } from './SettingsToggle';

describe('SettingsToggle', () => {
  it('should render with label and default state', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={false}
        onChange={() => {}}
      />
    );
    
    expect(screen.getByText('Test Toggle')).toBeInTheDocument();
    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-checked', 'false');
  });

  it('should render in active state when value is true', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={true}
        onChange={() => {}}
      />
    );
    
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onChange when clicked', () => {
    const onChangeMock = jest.fn();
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={false}
        onChange={onChangeMock}
      />
    );
    
    const button = screen.getByRole('switch');
    fireEvent.click(button);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('should display status text when provided', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={false}
        onChange={() => {}}
        statusText="Status: Off"
      />
    );
    
    expect(screen.getByText('Status: Off')).toBeInTheDocument();
  });

  it('should display children when value is true', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={true}
        onChange={() => {}}
      >
        <div data-testid="children">Toggle is active</div>
      </SettingsToggle>
    );
    
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('should not display children when value is false', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={false}
        onChange={() => {}}
      >
        <div data-testid="children">Toggle is active</div>
      </SettingsToggle>
    );
    
    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
  });

  it('should use green color when activeColor is green', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={true}
        onChange={() => {}}
        activeColor="green"
      />
    );
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('bg-green-500');
  });

  it('should use blue color by default', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={true}
        onChange={() => {}}
      />
    );
    
    const button = screen.getByRole('switch');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('should render with clean variant when specified', () => {
    render(
      <SettingsToggle 
        label="Test Toggle"
        value={false}
        onChange={() => {}}
        variant="clean"
      />
    );
    
    const button = screen.getByRole('switch');
    const container = button.closest('div[class*="py-2 flex flex-col group"]');
    expect(container).toHaveClass('py-2 flex flex-col group');
  });
});