// @flow
import React, { Component } from 'react';
import styles from './styles.css';
import xteam from './xteam.png';

type Props = {};

export default class InnerWindow extends Component<Props> {
  props: Props;

  render() {
    return <img src={xteam} className={styles.ad} />;
  }
}
