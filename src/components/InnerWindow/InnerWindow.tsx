import type { ReactNode } from 'react';
import styles from './InnerWindow.module.css';

interface InnerWindowProps {
  children: ReactNode;
  compact?: boolean;
  raised?: boolean;
  mergeDown?: boolean;
  fill?: boolean;
}

export function InnerWindow({ children, compact, raised, mergeDown, fill }: InnerWindowProps) {
  const outerClassName = [
    styles.outerFrame,
    fill ? styles.fill : '',
    raised ? styles.raised : '',
    mergeDown ? styles.mergeDown : '',
  ].filter(Boolean).join(' ');

  const innerClassName = [
    styles.innerFrame,
    compact ? styles.compact : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
