import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../src/App';

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => ({
    minimize: vi.fn(),
    toggleMaximize: vi.fn(),
    close: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders the window frame with title', () => {
    render(<App />);
    expect(screen.getByText('Ja (12345)')).toBeInTheDocument();
  });

  it('renders the Slaku-Slaku button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Slaku-Slaku' })).toBeInTheDocument();
  });

  it('renders menu buttons', () => {
    render(<App />);
    expect(screen.getByText(/Wiadomości/)).toBeInTheDocument();
    expect(screen.getByText(/Kontakty/)).toBeInTheDocument();
    expect(screen.getByText(/Strona WWW/)).toBeInTheDocument();
  });

  it('renders the contact list', () => {
    render(<App />);
    const kaspers = screen.getAllByText('Kasper');
    expect(kaspers.length).toBeGreaterThan(0);
  });
});
