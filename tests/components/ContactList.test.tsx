import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactList } from '../../src/components/ContactList';

const contacts = [
  { status: 'available' as const, name: 'Alice', id: '111' },
  { status: 'brb' as const, name: 'Bob', id: '222' },
  { status: 'unavailable' as const, name: 'Charlie', id: '333' },
];

describe('ContactList', () => {
  it('renders all contacts', () => {
    render(<ContactList contacts={contacts} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders a status icon for each contact', () => {
    render(<ContactList contacts={contacts} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('highlights selected contact on click', async () => {
    const user = userEvent.setup();
    render(<ContactList contacts={contacts} />);
    const alice = screen.getByText('Alice').closest('[class*="listItem"]') as HTMLElement;
    await user.click(alice);
    expect(alice.className).toContain('selected');
  });

  it('shows contact ID when selected', async () => {
    const user = userEvent.setup();
    render(<ContactList contacts={contacts} />);
    await user.click(screen.getByText('Alice'));
    expect(screen.getByText('111')).toBeInTheDocument();
  });

  it('deselects previous contact when new one is clicked', async () => {
    const user = userEvent.setup();
    render(<ContactList contacts={contacts} />);
    await user.click(screen.getByText('Alice'));
    await user.click(screen.getByText('Bob'));
    const alice = screen.getByText('Alice').closest('[class*="listItem"]') as HTMLElement;
    const bob = screen.getByText('Bob').closest('[class*="listItem"]') as HTMLElement;
    expect(alice.className).not.toContain('selected');
    expect(bob.className).toContain('selected');
  });
});
