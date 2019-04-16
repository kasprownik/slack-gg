// @flow
import React, { Component } from 'react';
import styles from './styles.css';
import classnames from 'classnames';

type Props = {
  children: any,
  compact: boolean,
  raised: boolean,
  mergeDown: boolean
};

export default class InnerWindow extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        className={classnames(
          styles.outerFrame,
          this.props.fill && styles.fill,
          this.props.raised && styles.raised,
          this.props.mergeDown && styles.mergeDown
        )}
      >
        <div
          className={classnames(
            styles.innerFrame,
            this.props.compact && styles.compact,
            this.props.fill && styles.fill
          )}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
