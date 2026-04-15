'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { SceneBackground } from '@/components/visualizers/ui/SceneBackground';

// Mock three.js and @react-three/fiber
jest.mock('three', () => ({
  Color: jest.fn().mockImplementation((color) => ({ color })),
}));

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

describe('SceneBackground Component', () => {
  test('should return null when enabled is false', () => {
    const result = render(<SceneBackground enabled={false} />);
    expect(result.container.firstChild).toBeNull();
  });

  test('should render color background with default color when enabled is true', () => {
    const { container } = render(<SceneBackground enabled={true} />);
    expect(container.firstChild).toBeTruthy();
  });

  test('should render color background with custom color when provided', () => {
    const customColor = '#ff0000';
    const { container } = render(<SceneBackground enabled={true} color={customColor} />);
    expect(container.firstChild).toBeTruthy();
  });

  test('should render gradient background when gradient prop is provided', () => {
    const gradient = {
      colors: ['#ff0000', '#00ff00', '#0000ff'],
      stops: [0, 0.5, 1],
    };
    const { container } = render(
      <SceneBackground enabled={true} gradient={gradient} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  test('should render gradient background with default stops when stops are not provided', () => {
    const gradient = {
      colors: ['#ff0000', '#00ff00'],
    };
    const { container } = render(
      <SceneBackground enabled={true} gradient={gradient} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  test('should render dynamic background when dynamic prop is provided', () => {
    const dynamic = {
      enabled: true,
      speed: 0.5,
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
    };
    const { container } = render(
      <SceneBackground enabled={true} dynamic={dynamic} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  test('should render dynamic background with default speed when speed is not provided', () => {
    const dynamic = {
      enabled: true,
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
    };
    const { container } = render(
      <SceneBackground enabled={true} dynamic={dynamic} />
    );
    expect(container.firstChild).toBeTruthy();
  });
});
