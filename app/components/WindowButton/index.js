// @flow
import React, { Component } from 'react';
import styles from './styles.css';
import classnames from 'classnames';

type Props = { children: any, size: 'small' | 'default' };

export default class WindowMenu extends Component<Props> {
  props: Props;

  render() {
    const { size = 'default' } = this.props;
    return (
      <button className={classnames(styles.menuItem, styles[size])}>
        {this.props.children}
      </button>
    );
  }
}
