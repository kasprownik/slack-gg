import { useState } from 'react';
import type { ContactStatus } from '../StatusIcon';
import { StatusIcon } from '../StatusIcon';
import { InnerWindow } from '../InnerWindow';
import styles from './ContactList.module.css';

export interface Contact {
  status: ContactStatus;
  name: string;
  id: string;
}

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedContact =
    selectedIndex !== null ? contacts[selectedIndex] : undefined;

  return (
    <InnerWindow compact fill>
      <div className={styles.container}>
        {contacts.map((contact, index) => {
          const isSelected = selectedIndex === index;
          const className = [styles.listItem, isSelected ? styles.selected : '']
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={`${contact.id}-${String(index)}`}
              className={className}
              onClick={() => {
                setSelectedIndex(index);
              }}
            >
              <StatusIcon status={contact.status} />
              <div className={styles.name}>{contact.name}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.contactInfo}>
        <div>
          ID{' '}
          {selectedContact !== undefined && <span>{selectedContact.id}</span>}
        </div>
        <div>tel</div>
      </div>
    </InnerWindow>
  );
}
