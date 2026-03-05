import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { WindowFrame } from '../../src/components/WindowFrame';

const mockMinimize = vi.fn();
const mockToggleMaximize = vi.fn();
const mockClose = vi.fn();

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => ({
    minimize: mockMinimize,
    toggleMaximize: mockToggleMaximize,
    close: mockClose,
  }),
}));

describe('WindowFrame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title', () => {
    render(<WindowFrame title="Test Window">Content</WindowFrame>);
    expect(screen.getByText('Test Window')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<WindowFrame title="Test">Hello World</WindowFrame>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders minimize button when minimizable', () => {
    render(<WindowFrame title="Test" minimizable>Content</WindowFrame>);
    expect(screen.getByLabelText('Minimize')).toBeInTheDocument();
  });

  it('does not render minimize button by default', () => {
    render(<WindowFrame title="Test">Content</WindowFrame>);
    expect(screen.queryByLabelText('Minimize')).not.toBeInTheDocument();
  });

  it('renders maximize button when maximizable', () => {
    render(<WindowFrame title="Test" maximizable>Content</WindowFrame>);
    expect(screen.getByLabelText('Maximize')).toBeInTheDocument();
  });

  it('always renders close button', () => {
    render(<WindowFrame title="Test">Content</WindowFrame>);
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('calls Tauri minimize on minimize click', async () => {
    const user = userEvent.setup();
    render(<WindowFrame title="Test" minimizable>Content</WindowFrame>);
    await user.click(screen.getByLabelText('Minimize'));
    expect(mockMinimize).toHaveBeenCalledOnce();
  });

  it('calls Tauri close on close click', async () => {
    const user = userEvent.setup();
    render(<WindowFrame title="Test">Content</WindowFrame>);
    await user.click(screen.getByLabelText('Close'));
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it('calls Tauri toggleMaximize on maximize click', async () => {
    const user = userEvent.setup();
    render(<WindowFrame title="Test" maximizable>Content</WindowFrame>);
    await user.click(screen.getByLabelText('Maximize'));
    expect(mockToggleMaximize).toHaveBeenCalledOnce();
  });
});
