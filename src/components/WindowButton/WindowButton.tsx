import type { ReactNode } from 'react';
import styles from './WindowButton.module.css';

interface WindowButtonProps {
  children: ReactNode;
  size?: 'default' | 'small';
  onClick?: () => void;
}

export function WindowButton({
  children,
  size = 'default',
  onClick,
}: WindowButtonProps) {
  const className = [styles.menuItem, size === 'small' ? styles.small : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button className={className} onClick={onClick} type="button">
      {children}
    </button>
  );
}
