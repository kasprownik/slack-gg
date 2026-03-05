import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WindowButton } from '../../src/components/WindowButton';

describe('WindowButton', () => {
  it('renders children', () => {
    render(<WindowButton>Messages</WindowButton>);
    expect(screen.getByRole('button', { name: 'Messages' })).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(<WindowButton size="small">Test</WindowButton>);
    const button = screen.getByRole('button', { name: 'Test' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<WindowButton onClick={handleClick}>Click Me</WindowButton>);
    await user.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
