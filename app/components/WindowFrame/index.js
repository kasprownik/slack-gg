// @flow
import React, { Component } from 'react';
import styles from './styles.css';
import classnames from 'classnames';
import defaultIcon from './defaultIcon.png';
import InnerWindow from '../InnerWindow';

type Props = {
  children: any,
  minimizabe: boolean,
  maximizable: boolean,
  title: string
};

export default class WindowFrame extends Component<Props> {
  props: Props;

  render() {
    const { minimizabe, maximizable, title } = this.props;
    return (
      <div className={styles.mainContainer}>
        <div className={styles.mainInnerContainer}>
          <div className={styles.titleBar}>
            <div className={styles.title}>{title}</div>
            <div className={styles.buttons}>
              {minimizabe && <button className={styles.minimizeButton} />}
              {maximizable && <button className={styles.maximizeButton} />}
              <button className={styles.closeButton} />
            </div>
          </div>
          <InnerWindow fill>{this.props.children}</InnerWindow>
        </div>
      </div>
    );
  }
}
