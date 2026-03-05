import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ad } from '../../src/components/Ad';

describe('Ad', () => {
  it('renders an image', () => {
    render(<Ad />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });
});
