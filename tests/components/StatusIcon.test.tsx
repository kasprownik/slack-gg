import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusIcon } from '../../src/components/StatusIcon';

describe('StatusIcon', () => {
  it('renders an image with the correct alt text', () => {
    render(<StatusIcon status="available" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'available');
  });

  it('renders each status variant', () => {
    const statuses = ['available', 'brb', 'invisible', 'unavailable'] as const;
    for (const status of statuses) {
      const { unmount } = render(<StatusIcon status={status} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', status);
      unmount();
    }
  });
});
