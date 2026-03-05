import type { ReactNode } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { InnerWindow } from '../InnerWindow';
import styles from './WindowFrame.module.css';

interface WindowFrameProps {
  children: ReactNode;
  title: string;
  minimizable?: boolean;
  maximizable?: boolean;
}

export function WindowFrame({
  children,
  title,
  minimizable,
  maximizable,
}: WindowFrameProps) {
  const appWindow = getCurrentWindow();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainInnerContainer}>
        <div className={styles.titleBar} data-tauri-drag-region>
          <div className={styles.title}>{title}</div>
          <div className={styles.buttons}>
            {minimizable && (
              <button
                className={styles.minimizeButton}
                aria-label="Minimize"
                onClick={() => {
                  void appWindow.minimize();
                }}
                type="button"
              />
            )}
            {maximizable && (
              <button
                className={styles.maximizeButton}
                aria-label="Maximize"
                onClick={() => {
                  void appWindow.toggleMaximize();
                }}
                type="button"
              />
            )}
            <button
              className={styles.closeButton}
              aria-label="Close"
              onClick={() => {
                void appWindow.close();
              }}
              type="button"
            />
          </div>
        </div>
        <InnerWindow fill>{children}</InnerWindow>
      </div>
    </div>
  );
}
