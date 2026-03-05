import { WindowFrame } from './components/WindowFrame';
import { WindowButton } from './components/WindowButton';
import { InnerWindow } from './components/InnerWindow';
import { ContactList } from './components/ContactList';
import type { Contact } from './components/ContactList';
import { Ad } from './components/Ad';
import messagesIcon from './assets/messagesIcon.png';
import contactsIcon from './assets/contactsIcon.png';
import wwwIcon from './assets/wwwIcon.png';

const contacts: Contact[] = [
  { status: 'available', name: 'Kasper', id: '12345' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
  { status: 'available', name: 'Kasper', id: '54321' },
  { status: 'available', name: 'Kasper', id: '12321' },
];

export default function App() {
  return (
    <WindowFrame title="Ja (12345)">
      <div>
        <WindowButton>Slaku-Slaku</WindowButton>
      </div>
      <InnerWindow raised mergeDown>
        <div>
          <WindowButton size="small">
            <img src={messagesIcon} alt="" /> Wiadomości
          </WindowButton>
          <WindowButton size="small">
            <img src={contactsIcon} alt="" /> Kontakty
          </WindowButton>
          <WindowButton size="small">
            <img src={wwwIcon} alt="" /> Strona WWW
          </WindowButton>
        </div>
        <Ad />
      </InnerWindow>
      <ContactList contacts={contacts} />
    </WindowFrame>
  );
}
