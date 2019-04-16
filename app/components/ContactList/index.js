// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './styles.css';
import InnerWindow from '../InnerWindow';
import StatusIcon from '../StatusIcon';

type Props = {
  children: any,
  contacts: Array<{ status: 'available' | 'unavailable' | 'brb', name: string }>
};

export default class ContactList extends Component<Props> {
  props: Props;

  state = { selectedIndex: null };

  selectItem = selectedIndex => {
    this.setState({ selectedIndex });
  };

  render() {
    return (
      <InnerWindow compact fill>
        <div className={styles.container}>
          {this.props.contacts.map((contact, index) => (
            <div
              onClick={this.selectItem.bind(null, index)}
              key={index}
              className={classnames(
                styles.listItem,
                this.state.selectedIndex === index && styles.selected
              )}
            >
              <StatusIcon status="available" />
              <div className={styles.name}>Kasper</div>
            </div>
          ))}
        </div>
        <div className={styles.contactInfo}>
          <div>
            ID{' '}
            {this.state.selectedIndex !== null &&
              this.props.contacts[this.state.selectedIndex].id}
          </div>
          <div>tel</div>
        </div>
      </InnerWindow>
    );
  }
}
