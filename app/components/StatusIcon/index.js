// @flow
import React, { Component } from 'react';
import styles from './styles.css';
import available from './available.png';
import unavailable from './unavailable.png';
import invisible from './invisible.png';
import brb from './brb.png';

type Props = {
  children: any,
  status: 'available' | 'brb' | 'invisible' | 'unavailable'
};

const paths = { available, unavailable, invisible, brb };

export default class InnerWindow extends Component<Props> {
  props: Props;

  render() {
    return <img src={paths[this.props.status]} className={styles.status} />;
  }
}
