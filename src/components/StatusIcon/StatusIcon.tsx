import styles from './StatusIcon.module.css';
import available from './available.png';
import brb from './brb.png';
import invisible from './invisible.png';
import unavailable from './unavailable.png';

export type ContactStatus = 'available' | 'brb' | 'invisible' | 'unavailable';

const iconPaths: Record<ContactStatus, string> = {
  available,
  brb,
  invisible,
  unavailable,
};

interface StatusIconProps {
  status: ContactStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  return (
    <img
      src={iconPaths[status]}
      alt={status}
      className={styles.status}
    />
  );
}
