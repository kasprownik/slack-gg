// @flow
import React, { Component } from 'react';
import WindowFrame from '../../components/WindowFrame';
import ContactList from '../../components/ContactList';
import WindowButton from '../../components/WindowButton';
import InnerWindow from '../../components/InnerWindow';
import Ad from '../../components/Ad';
import messagesIcon from './messagesIcon.png';
import contactsIcon from './contactsIcon.png';
import wwwIcon from './wwwIcon.png';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <WindowFrame title="Ja (12345)">
        <div>
          <WindowButton>Slaku-Slaku</WindowButton>
        </div>
        <InnerWindow raised mergeDown>
          <div>
            <WindowButton size="small">
              <img src={messagesIcon} /> Wiadomości
            </WindowButton>
            <WindowButton size="small">
              <img src={contactsIcon} /> Kontakty
            </WindowButton>
            <WindowButton size="small">
              <img src={wwwIcon} /> Strona WWW
            </WindowButton>
          </div>
          <Ad />
        </InnerWindow>
        <ContactList
          contacts={[
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
            { status: 'available', name: 'Kasper', id: '12321' }
          ]}
        />
      </WindowFrame>
    );
  }
}
